import { Router, type IRouter } from "express";
import healthRouter from "./health";
import woocommerceRouter from "./woocommerce";
import settingsRouter from "./settings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(woocommerceRouter);
router.use(settingsRouter);

export default router;
