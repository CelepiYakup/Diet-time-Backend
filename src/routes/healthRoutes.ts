import express from 'express';
import { BodyMeasurementController } from '../controllers/bodyMeasurementController';
import { VitalSignController } from '../controllers/vitalSignController';
import { BloodWorkController } from '../controllers/bloodWorkController';
import { SleepPatternController } from '../controllers/sleepPatternController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();


router.use(authMiddleware);

router.post('/body-measurements', BodyMeasurementController.createBodyMeasurement);
router.get('/body-measurements/user/:userId', BodyMeasurementController.getBodyMeasurementsByUserId);
router.put('/body-measurements/:id', BodyMeasurementController.updateBodyMeasurement);
router.delete('/body-measurements/:id', BodyMeasurementController.deleteBodyMeasurement);

router.post('/vital-signs', VitalSignController.createVitalSign);
router.get('/vital-signs/user/:userId', VitalSignController.getVitalSignsByUserId);
router.put('/vital-signs/:id', VitalSignController.updateVitalSign);
router.delete('/vital-signs/:id', VitalSignController.deleteVitalSign);

router.post('/blood-work', BloodWorkController.createBloodWork);
router.get('/blood-work/user/:userId', BloodWorkController.getBloodWorkByUserId);
router.put('/blood-work/:id', BloodWorkController.updateBloodWork);
router.delete('/blood-work/:id', BloodWorkController.deleteBloodWork);

router.post('/sleep-patterns', SleepPatternController.createSleepPattern);
router.get('/sleep-patterns/user/:userId', SleepPatternController.getSleepPatternsByUserId);
router.put('/sleep-patterns/:id', SleepPatternController.updateSleepPattern);
router.delete('/sleep-patterns/:id', SleepPatternController.deleteSleepPattern);

export default router;
