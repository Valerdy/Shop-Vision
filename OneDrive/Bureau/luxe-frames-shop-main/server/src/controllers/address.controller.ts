import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../services/address.service';

export const getAll = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    res.status(401).json({ success: false, message: 'Non authentifié' });
    return;
  }

  const addresses = await getAddresses(req.userId);

  res.status(200).json({
    success: true,
    data: { addresses },
  });
});

export const get = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    res.status(401).json({ success: false, message: 'Non authentifié' });
    return;
  }

  const { id } = req.params;
  const address = await getAddressById(id, req.userId);

  if (!address) {
    res.status(404).json({ success: false, message: 'Adresse non trouvée' });
    return;
  }

  res.status(200).json({
    success: true,
    data: { address },
  });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    res.status(401).json({ success: false, message: 'Non authentifié' });
    return;
  }

  const address = await createAddress(req.userId, req.body);

  res.status(201).json({
    success: true,
    message: 'Adresse créée avec succès',
    data: { address },
  });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    res.status(401).json({ success: false, message: 'Non authentifié' });
    return;
  }

  const { id } = req.params;
  const address = await updateAddress(id, req.userId, req.body);

  res.status(200).json({
    success: true,
    message: 'Adresse mise à jour',
    data: { address },
  });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    res.status(401).json({ success: false, message: 'Non authentifié' });
    return;
  }

  const { id } = req.params;
  await deleteAddress(id, req.userId);

  res.status(200).json({
    success: true,
    message: 'Adresse supprimée',
  });
});

export const setDefault = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    res.status(401).json({ success: false, message: 'Non authentifié' });
    return;
  }

  const { id } = req.params;
  const address = await setDefaultAddress(id, req.userId);

  res.status(200).json({
    success: true,
    message: 'Adresse par défaut définie',
    data: { address },
  });
});
