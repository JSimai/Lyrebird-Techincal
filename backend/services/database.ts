import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const db = {
  async createPatient(firstName: string, lastName: string) {
    return prisma.patient.create({
      data: {
        firstName,
        lastName,
      },
    });
  },

  async getPatient(id: string) {
    return prisma.patient.findUnique({
      where: { id },
      include: { consultations: true },
    });
  },

  async createConsultation(
    patientId: string,
    date: Date,
    time: string,
    notes: string,
    summary: any
  ) {
    return prisma.consultation.create({
      data: {
        patientId,
        date,
        time,
        notes,
        summary,
      },
    });
  },

  async getConsultations(patientId: string) {
    return prisma.consultation.findMany({
      where: { patientId },
      orderBy: { date: 'desc' },
    });
  },

  async getPatients() {
    return prisma.patient.findMany({
      orderBy: { createdAt: 'desc' }
    });
  },
};