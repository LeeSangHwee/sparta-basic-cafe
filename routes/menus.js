import { PrismaClient } from "@prisma/client";
import express from "express";

const router = express.Router();
const prisma = new PrismaClient(); // Prisma 클라이언트 생성

router.get("/stats", async (req, res) => {
  try {
    // 메뉴의 총 개수
    const totalMenus = await prisma.menus.count();

    // 메뉴의 주문 수
    const totalOrders = await prisma.totalOrders.aggregate({
      _sum: {
        quantity: true,
      },
    });

    // 총 매출
    const totalSales = await prisma.totalOrders.aggregate({
      _sum: {
        totalOrder_price: true,
      },
    });

    // response
    res.status(200).json({
      stats: {
        totalMenus: totalMenus || 0,
        totalOrders: totalOrders._sum.quantity || 0,
        totalSales: totalSales._sum.quantity || 0,
      },
    });
  } catch (error) {
    console.log("get stats error", error);
    res.status(400).json("get stats error");
  }
});

router.get("/", async (req, res) => {
  try {
    // 메뉴 목록을 반환합니다.
    const menus = await prisma.menus.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        temperature: true,
        price: true,
      },
    });

    const orderCounts = await prisma.totalOrders.groupBy({
      by: ["menu_id"],
      _sum: {
        quantity: true,
      },
    });

    const formattedMenus = menus.map((menu) => {
      const orderInfo = orderCounts.find((order) => order.menuId === menu.id);
      return {
        id: menu.id,
        name: menu.name || "not found",
        type: menu.type || "not found",
        temperature: menu.temperature || "not found",
        price: menu.price || 0,
        totalOrders: orderInfo?._sum?.quantity || 0,
      };
    });

    // response
    res.status(200).json({
      menus: formattedMenus,
    });
  } catch (error) {
    console.log("get error", error);
    res.status(400).json("get error");
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, type, temperature, price } = req.body;

    const newMenu = await prisma.menus.create({
      data: {
        name,
        type,
        temperature,
        price,
      },
    });

    // response
    res.status(200).json({
      menus: newMenu,
    });
  } catch (error) {
    console.log("get error", error);
    res.status(400).json("get error");
  }
});

router.put("/", async (req, res) => {
  try {
    // response
    res.status(200).json({
      menus: formattedMenus,
    });
  } catch (error) {
    console.log("get error", error);
    res.status(400).json("get error");
  }
});

router.delete("/", async (req, res) => {
  try {
    // response
    res.status(200).json({
      menus: formattedMenus,
    });
  } catch (error) {
    console.log("get error", error);
    res.status(400).json("get error");
  }
});

export default router;
