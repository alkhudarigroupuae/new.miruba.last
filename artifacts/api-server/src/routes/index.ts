import { Router, type IRouter } from "express";
import healthRouter from "./health";
import woocommerceRouter from "./woocommerce";
import settingsRouter from "./settings";
import newsletterRouter from "./newsletter";

const router: IRouter = Router();

router.use(healthRouter);
router.use(woocommerceRouter);
router.use(settingsRouter);
router.use(newsletterRouter);

export default router;
