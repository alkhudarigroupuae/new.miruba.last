import { Router, type IRouter } from "express";
import healthRouter from "./health";
import woocommerceRouter from "./woocommerce";

const router: IRouter = Router();

router.use(healthRouter);
router.use(woocommerceRouter);

export default router;
