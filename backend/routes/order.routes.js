const router = require("express").Router();
const orderController = require("../controllers/orderController");
const middlewareController = require("../controllers/middlewareController");

// CRUD đơn hàng
router.post("/", middlewareController.verifyToken, orderController.createOrder);
router.get("/", middlewareController.verifyTokenAndAdminAuth, orderController.getAllOrders);
router.get("/:id", middlewareController.verifyToken, orderController.getOrderById);
router.put("/:id", middlewareController.verifyTokenAndAdminAuth, orderController.updateOrderStatus);
router.delete("/:id", middlewareController.verifyTokenAndAdminAuth, orderController.deleteOrder);

module.exports = router;
