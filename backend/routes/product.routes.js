const router = require("express").Router();
const productController = require("../controllers/productController");
const middlewareController = require("../controllers/middlewareController");

// CRUD sản phẩm
router.post("/", middlewareController.verifyTokenAndAdminAuth, productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", middlewareController.verifyTokenAndAdminAuth, productController.updateProduct);
router.delete("/:id", middlewareController.verifyTokenAndAdminAuth, productController.deleteProduct);

module.exports = router;
