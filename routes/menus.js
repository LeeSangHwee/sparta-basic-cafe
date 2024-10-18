import express from 'express';
const router = express.Router();

router.get('/stats', (req, res, next) => {
    res.status(200).json({
        stats: {
            totalMenus: 3,
            totalOrders: 10,
            totalSales: 30000
        }
    });
});

const menus = [
    {
        id: 1,
        name: 'Latte',
        type: 'Coffee',
        temperature: 'hot',
        price: 4500,
        totalOrders: 5
    },
    {
        id: 2,
        name: 'Iced Tea',
        type: 'Tea',
        temperature: 'ice',
        price: 3000,
        totalOrders: 10
    }
];

router.get('/', (req, res, next) => {
    res.status(200).json({
        menus
    });
});

router.get('/:menuId', (req, res, next) => {
    const id = req.params.menuId;
    const menu = menus[0];

    res.status(200).json({
        menu
    });
});

router.post('/', (req, res, next) => {
    console.log(req.body);

    res.status(201).json({
        message: '메뉴 생성되었습니다.',
        menu: {
            id: 123,
        }
    });
});

router.put('/:menuId', (req, res, next) => {
    const id = req.params.menuId;
    console.log(req.body);

    res.status(200).json({
        message: `메뉴 ${id} 수정되었습니다.`
    });
});

router.delete('/:menuId', (req, res, next) => {
    const id = req.params.menuId;
    console.log(req.body)

    res.status(200).json({
        message: `메뉴 ${id} 삭제되었습니다.`
    });
});

export default router;
