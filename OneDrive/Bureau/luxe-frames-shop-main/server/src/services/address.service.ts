import { prisma } from '../config/prisma';
import { Prisma } from '@prisma/client';

export const getAddresses = async (userId: string) => {
  return await prisma.address.findMany({
    where: { userId },
    orderBy: [
      { isDefault: 'desc' },
      { createdAt: 'desc' },
    ],
  });
};

export const getAddressById = async (addressId: string, userId: string) => {
  return await prisma.address.findFirst({
    where: {
      id: addressId,
      userId,
    },
  });
};

export const createAddress = async (userId: string, data: Prisma.AddressCreateInput) => {
  // Si c'est la première adresse ou si on veut la définir par défaut
  if (data.isDefault) {
    // Retirer le statut par défaut des autres adresses
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  return await prisma.address.create({
    data: {
      ...data,
      userId,
    },
  });
};

export const updateAddress = async (
  addressId: string,
  userId: string,
  data: Prisma.AddressUpdateInput
) => {
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });

  if (!address) {
    throw new Error('Adresse introuvable');
  }

  // Si on définit comme adresse par défaut
  if (data.isDefault === true) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  return await prisma.address.update({
    where: { id: addressId },
    data,
  });
};

export const deleteAddress = async (addressId: string, userId: string) => {
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });

  if (!address) {
    throw new Error('Adresse introuvable');
  }

  return await prisma.address.delete({
    where: { id: addressId },
  });
};

export const setDefaultAddress = async (addressId: string, userId: string) => {
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });

  if (!address) {
    throw new Error('Adresse introuvable');
  }

  // Retirer le statut par défaut des autres
  await prisma.address.updateMany({
    where: { userId },
    data: { isDefault: false },
  });

  // Définir cette adresse comme par défaut
  return await prisma.address.update({
    where: { id: addressId },
    data: { isDefault: true },
  });
};
