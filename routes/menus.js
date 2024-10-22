import { PrismaClient } from "@prisma/client";
import express from "express";

const router = express.Router();
const prisma = new PrismaClient(); // Prisma 클라이언트 생성

// router.post("/orders", async (req, res, next) => {
//   try {
//     // 주문 받기
//     let { menu_id, quantity } = req.body;
//     // 메뉴 가격 계산
//     const menu = await prisma.menus.findUnique({ where: { id: menu_id } });
//     const totalOrder_price = menu.price * quantity;

//     // 신규 totalOrders 생성
//     const newOrder = await prisma.totalOrders.create({
//       data: {
//         date: new Date(),
//         quantity,
//         totalOrder_price,
//         menu_id,
//       },
//     });

//     // response
//     res
//       .status(201)
//       .json({ message: "주문이 성공적으로 완료되었습니다.", newOrder });
//   } catch (error) {
//     console.log("create orders error", error);
//     res.status(400).json("create orders error");
//   }
// });

router.get("/stats", async (req, res, next) => {
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

router.get("/", async (req, res, next) => {
  try {
    // 메뉴 목록 쿼리로 가져오기
    const menusQuary = await prisma.menus.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        temperature: true,
        price: true,
        totalOrders: {
          select: {
            quantity: true,
          },
        },
      },
    });

    // 메뉴와 총 주문량을 합쳐서 포맷팅
    const menusFormatting = menusQuary.map((menu) => {
      return {
        id: menu.id,
        name: menu.name || "not found",
        type: menu.type || "not found",
        temperature: menu.temperature || "not found",
        price: menu.price || 0,
        totalOrders: menu.totalOrders.reduce(
          (sum, order) => sum + order.quantity,
          0
        ),
      };
    });

    // response
    res.status(200).json({ menus: menusFormatting });
  } catch (error) {
    console.log("get error", error);
    res.status(400).json("get error");
  }
});

// 특정 메뉴 반환
router.get("/:menuId", async (req, res, next) => {
  try {
    // request
    const id = parseInt(req.params.menuId);

    // 특정 메뉴 조회
    const menu = await prisma.menus.findUnique({
      where: { id },
    });

    // response
    if (menu) res.status(200).json({ menu });
  } catch (error) {
    console.log("get menu error", error);
    res.status(400).json("get menu error");
  }
});

// 메뉴 생성
router.post("/", async (req, res, next) => {
  try {
    // request
    const { name, type, temperature, price } = req.body;

    // 새 메뉴 생성
    const newMenu = await prisma.menus.create({
      data: {
        name: name,
        type: type,
        temperature: temperature,
        price: parseFloat(price),
      },
    });

    // response
    res.status(201).json({
      message: "메뉴가 생성되었습니다.",
      menu: newMenu,
    });
  } catch (error) {
    console.log("create menu error", error);
    res.status(400).json("create menu error");
  }
});

// 메뉴 수정
router.put("/:menuId", async (req, res, next) => {
  try {
    // request
    const id = parseInt(req.params.menuId);
    const { name, type, temperature, price } = req.body;

    // 메뉴 수정
    const updatedMenu = await prisma.menus.update({
      where: { id },
      data: {
        name: name,
        type: type,
        temperature: temperature,
        price: parseFloat(price),
      },
    });

    // response
    res.status(200).json({
      message: `메뉴 ${id}이(가) 수정되었습니다.`,
      menu: updatedMenu,
    });
  } catch (error) {
    console.log("update menu error", error);
    res.status(400).json("update menu error");
  }
});

// 메뉴 삭제
router.delete("/:menuId", async (req, res, next) => {
  try {
    // request
    const id = parseInt(req.params.menuId);

    // 메뉴 삭제
    await prisma.menus.delete({
      where: { id },
    });

    // response
    res.status(200).json({
      message: `메뉴 ${id}이(가) 삭제되었습니다.`,
    });
  } catch (error) {
    console.log("delete menu error", error);
    res.status(400).json("delete menu error");
  }
});

export default router;
