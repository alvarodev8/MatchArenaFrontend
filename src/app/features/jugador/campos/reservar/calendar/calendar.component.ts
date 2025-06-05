import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format, parseISO, startOfYear, endOfYear, eachDayOfInterval, startOfToday } from 'date-fns';
import { ReservasService } from '../../../reservas/reservas.service';
import { Pitch } from '../../../../../core/models/pitch.model';

interface CustomEventInput extends EventInput {
    extendedProps: {
        available: boolean;
    };
}

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [CommonModule, FullCalendarModule],
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
    @Input() pitch!: Pitch;
    @Input() minDate!: string;
    @Input() maxDate!: string;
    @Output() dateSelected = new EventEmitter<string>();

    private datesInRange: Date[] = [];
    private selectedDate: string | null = null;
    private isLoading = false;

    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        validRange: { start: startOfYear(startOfToday()), end: endOfYear(startOfToday()) },
        dateClick: this.handleDateClick.bind(this),
        events: [] as CustomEventInput[],
        locale: 'es',
        firstDay: 1,
        buttonText: { today: 'Hoy', month: 'Mes' }
    };

    constructor(private reservasService: ReservasService) { }

    ngOnInit(): void {
        if (!this.minDate || !this.maxDate) {
            console.error('minDate y maxDate son requeridos');
            return;
        }

        const start = parseISO(this.minDate);
        const end = parseISO(this.maxDate);

        this.datesInRange = eachDayOfInterval({ start, end });
        this.calendarOptions.initialDate = startOfToday();

        this.loadAvailableDates();
    }

    private loadAvailableDates(): void {
        this.reservasService.getAvailableDates(this.pitch!.id, this.minDate, this.maxDate).subscribe({
            next: (response) => {
                const availableDatesMap = new Map<string, boolean>();
                response.dates.forEach(date => {
                    availableDatesMap.set(date.date, date.available);
                });

                const events: CustomEventInput[] = [];

                // Eventos para los días dentro del rango
                const rangeEvents = this.datesInRange
                    .filter(date => availableDatesMap.has(format(date, 'yyyy-MM-dd')))
                    .map(date => {
                        const dateStr = format(date, 'yyyy-MM-dd');
                        const isAvailable = availableDatesMap.get(dateStr)!;

                        return {
                            title: isAvailable ? 'Disponible' : 'No disponible',
                            date: dateStr,
                            allDay: true,
                            backgroundColor: isAvailable ? '#28a745' : '#cccccc',
                            textColor: isAvailable ? '#fff' : '#666',
                            extendedProps: { available: isAvailable },
                            display: 'auto',
                            classNames: ['in-range', this.selectedDate === dateStr ? 'selected-day' : ''].filter(Boolean)
                        };
                    });
                events.push(...rangeEvents);

                // Eventos para los días fuera del rango dentro
                const startOfYearDate = startOfYear(startOfToday());
                const endOfYearDate = endOfYear(startOfToday());
                const allDaysInYear = eachDayOfInterval({ start: startOfYearDate, end: endOfYearDate });
                const outOfRangeDays = allDaysInYear.filter(date => !this.datesInRange.some(rangeDate => format(rangeDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')));

                const outOfRangeEvents = outOfRangeDays.map(date => ({
                    date: format(date, 'yyyy-MM-dd'),
                    allDay: true,
                    backgroundColor: '#e0e0e0',
                    borderColor: '#d3d3d3',
                    display: 'background',
                    extendedProps: { available: false }
                }));
                events.push(...outOfRangeEvents);

                this.calendarOptions.events = events;
            },
            error: (err) => console.error('Error al cargar fechas disponibles:', err)
        });
    }

    handleDateClick(info: any): void {
        if (this.isLoading) return;
        this.isLoading = true;

        const selectedDate = format(parseISO(info.dateStr), 'yyyy-MM-dd');

        if (this.datesInRange.some(date => format(date, 'yyyy-MM-dd') === selectedDate)) {
            const events = this.calendarOptions.events as CustomEventInput[];
            const event = events?.find((e: CustomEventInput) => e.date === selectedDate);
            if (event?.extendedProps.available) {
                this.selectedDate = selectedDate;
                this.dateSelected.emit(selectedDate);
                this.loadAvailableDates();
            }
        }
        this.isLoading = false;
    }
}