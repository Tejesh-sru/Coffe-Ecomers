import express from 'express';

import { requireAuth } from '../middleware/auth.js';
import { CartItem } from '../models/CartItem.js';

const router = express.Router();

const toCartResponse = (item) => ({
  id: item._id.toString(),
  name: item.name,
  price: item.price,
  image: item.image,
  quantity: item.quantity,
});

const getUserCart = async (userId) => {
  const items = await CartItem.find({ user: userId }).sort({ createdAt: 1 });
  return items.map(toCartResponse);
};

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const cart = await getUserCart(req.user._id);
    return res.json(cart);
  } catch (error) {
    return next(error);
  }
});

router.post('/add', requireAuth, async (req, res, next) => {
  try {
    const { name, price, image, quantity } = req.body ?? {};

    if (!name || typeof price !== 'number' || !Number.isFinite(price) || price <= 0) {
      return res.status(400).json({ message: 'name and valid price are required' });
    }

    const safeQuantity = Math.max(1, Number(quantity) || 1);

    const existingItem = await CartItem.findOne({
      user: req.user._id,
      name: String(name).trim(),
    });

    if (existingItem) {
      existingItem.quantity += safeQuantity;
      existingItem.price = price;
      existingItem.image = image ?? existingItem.image;
      await existingItem.save();
    } else {
      await CartItem.create({
        user: req.user._id,
        name: String(name).trim(),
        price,
        image: image ?? '',
        quantity: safeQuantity,
      });
    }

    const cart = await getUserCart(req.user._id);
    return res.json(cart);
  } catch (error) {
    return next(error);
  }
});

router.put('/quantity', requireAuth, async (req, res, next) => {
  try {
    const { name, quantity } = req.body ?? {};

    if (!name || !Number.isFinite(Number(quantity))) {
      return res.status(400).json({ message: 'name and quantity are required' });
    }

    const target = await CartItem.findOne({
      user: req.user._id,
      name: String(name).trim(),
    });

    if (target) {
      const qty = Number(quantity);
      if (qty <= 0) {
        await target.deleteOne();
      } else {
        target.quantity = qty;
        await target.save();
      }
    }

    const cart = await getUserCart(req.user._id);
    return res.json(cart);
  } catch (error) {
    return next(error);
  }
});

router.delete('/:productName', requireAuth, async (req, res, next) => {
  try {
    await CartItem.deleteOne({
      user: req.user._id,
      name: req.params.productName,
    });

    const cart = await getUserCart(req.user._id);
    return res.json(cart);
  } catch (error) {
    return next(error);
  }
});

router.delete('/clear', requireAuth, async (req, res, next) => {
  try {
    await CartItem.deleteMany({ user: req.user._id });
    return res.json([]);
  } catch (error) {
    return next(error);
  }
});

export default router;
