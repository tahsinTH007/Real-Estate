import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function nextPaymentDate(startDate: Date): Date {
  const today = new Date();
  const next = new Date(startDate);
  while (next <= today) next.setMonth(next.getMonth() + 1);
  return next;
}

/**
 * Leases visible to the caller: a tenant sees their own leases, a manager
 * sees leases on properties they manage.
 */
export const getLeases = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const leases = await prisma.lease.findMany({
      where:
        user.role === "manager"
          ? { property: { managerCognitoId: user.id } }
          : { tenantCognitoId: user.id },
      include: {
        tenant: true,
        property: { include: { location: true, manager: true } },
      },
      orderBy: { startDate: "desc" },
    });

    res.json(
      leases.map((lease) => ({
        ...lease,
        nextPaymentDate: nextPaymentDate(lease.startDate),
      })),
    );
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving leases: ${error.message}` });
  }
};

export const getLeasePayments = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const payments = await prisma.payment.findMany({
      where: { leaseId: Number(id) },
      orderBy: { dueDate: "desc" },
    });
    res.json(payments);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving lease payments: ${error.message}` });
  }
};
