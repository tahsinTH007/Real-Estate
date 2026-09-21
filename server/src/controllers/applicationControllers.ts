import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function calculateNextPaymentDate(startDate: Date): Date {
  const today = new Date();
  const nextPaymentDate = new Date(startDate);
  while (nextPaymentDate <= today) {
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
  }
  return nextPaymentDate;
}

export const listApplications = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId, userType } = req.query;

    let whereClause = {};

    if (userId && userType) {
      if (userType === "tenant") {
        whereClause = { tenantCognitoId: String(userId) };
      } else if (userType === "manager") {
        whereClause = {
          property: {
            managerCognitoId: String(userId),
          },
        };
      }
    }

    const applications = await prisma.application.findMany({
      where: whereClause,
      include: {
        property: {
          include: {
            location: true,
            manager: true,
          },
        },
        tenant: true,
      },
      orderBy: { applicationDate: "desc" },
    });

    const formattedApplications = await Promise.all(
      applications.map(async (app) => {
        const lease = await prisma.lease.findFirst({
          where: {
            tenant: {
              cognitoId: app.tenantCognitoId,
            },
            propertyId: app.propertyId,
          },
          orderBy: { startDate: "desc" },
        });

        return {
          ...app,
          property: {
            ...app.property,
            address: app.property.location.address,
          },
          manager: app.property.manager,
          lease: lease
            ? {
                ...lease,
                nextPaymentDate: calculateNextPaymentDate(lease.startDate),
              }
            : null,
        };
      }),
    );

    res.json(formattedApplications);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving applications: ${error.message}` });
  }
};

/**
 * Submitting an application only records the request. The lease is created
 * when (and only when) a manager approves it.
 */
export const createApplication = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      applicationDate,
      propertyId,
      tenantCognitoId,
      name,
      email,
      phoneNumber,
      message,
    } = req.body;

    // Tenants may only apply as themselves.
    if (req.user && req.user.id !== tenantCognitoId) {
      res.status(403).json({ message: "Access Denied" });
      return;
    }

    const property = await prisma.property.findUnique({
      where: { id: Number(propertyId) },
      select: { id: true },
    });

    if (!property) {
      res.status(404).json({ message: "Property not found" });
      return;
    }

    const newApplication = await prisma.application.create({
      data: {
        applicationDate: applicationDate ? new Date(applicationDate) : new Date(),
        status: "Pending",
        name,
        email,
        phoneNumber,
        message,
        property: { connect: { id: property.id } },
        tenant: { connect: { cognitoId: tenantCognitoId } },
      },
      include: {
        property: { include: { location: true, manager: true } },
        tenant: true,
      },
    });

    res.status(201).json({
      ...newApplication,
      manager: newApplication.property.manager,
      lease: null,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating application: ${error.message}` });
  }
};

export const updateApplicationStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status: "Approved" | "Denied" | "Pending" };

    const application = await prisma.application.findUnique({
      where: { id: Number(id) },
      include: {
        property: true,
        tenant: true,
      },
    });

    if (!application) {
      res.status(404).json({ message: "Application not found." });
      return;
    }

    // Managers may only act on applications for their own properties.
    if (req.user && application.property.managerCognitoId !== req.user.id) {
      res.status(403).json({ message: "Access Denied" });
      return;
    }

    if (status === "Approved" && application.status !== "Approved") {
      await prisma.$transaction(async (tx) => {
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setFullYear(endDate.getFullYear() + 1);

        const newLease = await tx.lease.create({
          data: {
            startDate,
            endDate,
            rent: application.property.pricePerMonth,
            deposit: application.property.securityDeposit,
            propertyId: application.propertyId,
            tenantCognitoId: application.tenantCognitoId,
          },
        });

        // First month's rent is due at lease start.
        await tx.payment.create({
          data: {
            amountDue: newLease.rent,
            amountPaid: 0,
            dueDate: startDate,
            paymentDate: startDate,
            paymentStatus: "Pending",
            leaseId: newLease.id,
          },
        });

        await tx.property.update({
          where: { id: application.propertyId },
          data: {
            tenants: {
              connect: { cognitoId: application.tenantCognitoId },
            },
          },
        });

        await tx.application.update({
          where: { id: Number(id) },
          data: { status, leaseId: newLease.id },
        });
      });
    } else {
      await prisma.application.update({
        where: { id: Number(id) },
        data: { status },
      });
    }

    const updatedApplication = await prisma.application.findUnique({
      where: { id: Number(id) },
      include: {
        property: { include: { location: true, manager: true } },
        tenant: true,
        lease: true,
      },
    });

    res.json({
      ...updatedApplication,
      manager: updatedApplication?.property.manager,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updating application status: ${error.message}` });
  }
};
