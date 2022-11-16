import { YupPipe } from './yup.pipe';
import * as Yup from 'yup';


describe('YupPipe', () => {
    const testSchema = Yup.object({
        test: Yup.string(),
    });

    it('should be defined', () => {
        expect(new YupPipe(testSchema)).toBeDefined();
    });
});
