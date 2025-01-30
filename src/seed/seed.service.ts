import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CITIES_SEED, COUNTRIES_SEED, DEPARTMENTS_SEED } from './data';

@Injectable()
export class SeedService {
  constructor(private readonly prisma: PrismaService) {}

  async executeLocationSeed() {
    return await this.prisma.$transaction(async (tx) => {
      // 🔴 Eliminar datos existentes dentro de la transacción
      await tx.city.deleteMany();
      await tx.department.deleteMany();
      await tx.country.deleteMany();

      // 🔴 Resetear contadores dentro de la transacción
      await tx.$executeRawUnsafe(`ALTER SEQUENCE "City_id_seq" RESTART WITH 1`);
      await tx.$executeRawUnsafe(
        `ALTER SEQUENCE "Department_id_seq" RESTART WITH 1`,
      );
      await tx.$executeRawUnsafe(
        `ALTER SEQUENCE "Country_id_seq" RESTART WITH 1`,
      );

      // ✅ Insertar País (asumiendo que siempre es "COLOMBIA")
      const colombia = await tx.country.upsert({
        where: { name: 'COLOMBIA' },
        update: {},
        create: COUNTRIES_SEED[0], // Se asume que el primer país es "COLOMBIA"
      });

      // ✅ Insertar Departamentos con countryId correcto
      await tx.department.createMany({
        data: DEPARTMENTS_SEED.map((dept) => ({
          ...dept,
          countryId: colombia.id,
        })),
      });

      // 🔹 Obtener departamentos y crear un Map para búsqueda rápida
      const departmentRecords = await tx.department.findMany();
      const departmentMap = new Map(
        departmentRecords.map((dept) => [dept.daneCode, dept.id]),
      );

      // ✅ Asignar departmentId a ciudades eficientemente
      const citiesWithDepartment = CITIES_SEED.map((city) => {
        const departmentId = departmentMap.get(city.daneCode.substring(0, 2));

        if (!departmentId) {
          throw new Error(
            `No se encontró un departamento para la ciudad con DANE ${city.daneCode}`,
          );
        }

        return { ...city, departmentId };
      });

      // ✅ Insertar ciudades
      await tx.city.createMany({ data: citiesWithDepartment });

      return {
        message: '🌱 Seed ejecutado correctamente',
        inserted: {
          countries: 1, // Asumimos que solo es "COLOMBIA"
          departments: departmentRecords.length,
          cities: citiesWithDepartment.length,
        },
      };
    });
  }
}
