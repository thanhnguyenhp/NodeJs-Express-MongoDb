const router = require("express").Router();
const customerController = require("../controllers/customerController");
const middlewareController = require("../controllers/middlewareController");

// CRUD khách hàng
router.post("/", middlewareController.verifyTokenAndAdminAuth, customerController.createCustomer);
router.get("/", middlewareController.verifyToken, customerController.getAllCustomers);
router.get("/:id", middlewareController.verifyToken, customerController.getCustomerById);
router.put("/:id", middlewareController.verifyTokenAndAdminAuth, customerController.updateCustomer);
router.delete("/:id", middlewareController.verifyTokenAndAdminAuth, customerController.deleteCustomer);

module.exports = router;
