import dayjs from 'dayjs';
import UTC from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(UTC);
dayjs.extend(customParseFormat);

export default dayjs;
