import { ptBR } from "date-fns/locale";
import { BsCalendar3 } from "react-icons/bs";
import DatePicker, { registerLocale } from "react-datepicker";
import { formatDate } from "@/utils/format";
import styles from "./DatePicker.module.css";

registerLocale("pt-BR", ptBR);

const WEEKDAY_LABELS = ["do", "2º", "3º", "4º", "5º", "6º", "sá"];
const PT_FULL_WEEKDAYS = [
  "domingo",
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
];

interface DatePickerProps {
  value: string;
  onChange: (iso: string) => void;
  ariaLabel?: string;
}

function parseISODate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function toISODate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatWeekday(dayName: string): string {
  const index = PT_FULL_WEEKDAYS.indexOf(dayName);

  return index === -1 ? dayName : WEEKDAY_LABELS[index];
}

function AppDatePicker({ value, onChange, ariaLabel }: DatePickerProps) {
  return (
    <DatePicker
      selected={parseISODate(value)}
      onChange={(date: Date | null) => onChange(date !== null ? toISODate(date) : "")}
      locale="pt-BR"
      dateFormat="dd/MM/yyyy"
      showPopperArrow={false}
      formatWeekDay={formatWeekday}
      customInput={
        <div className={styles.inputWrap}>
          <input
            type="text"
            className={`form-control ${styles.input}`}
            readOnly
            value={formatDate(value)}
            aria-label={ariaLabel}
          />
          <BsCalendar3 className={styles.calendarIcon} />
        </div>
      }
    />
  );
}

export default AppDatePicker;