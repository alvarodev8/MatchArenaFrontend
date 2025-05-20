import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservasService } from '../../../reservas/reservas.service';
import { Pitch } from '../../../../../core/models/pitch.model';

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
    @Input() pitch!: Pitch;
    @Input() minDate!: string;
    @Input() maxDate!: string;
    @Output() dateSelected = new EventEmitter<string>();
    selectedDate: string = '';
    currentMonthYear: string = '';
    daysInMonth: { day: number, date: string, available: boolean }[] = [];
    currentMonth: number = 0;
    currentYear: number = 0;
    currentYearMonth: number = 0;
    canGoToPreviousMonth: boolean = true;

    constructor(private reservasService: ReservasService) { }

    ngOnInit(): void {
        const now = new Date();
        this.currentMonth = now.getMonth();
        this.currentYear = now.getFullYear();
        this.currentYearMonth = now.getMonth();
        this.updateMonthYear();
        this.generateCalendar();
    }

    private generateCalendar(): void {
        const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
        const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 2, 0);
        const startDate = firstDayOfMonth.toISOString().split('T')[0];
        const endDate = lastDayOfMonth.toISOString().split('T')[0];

        this.reservasService.getAvailableDates(this.pitch!.id, startDate, endDate).subscribe({
            next: (dates) => {
                this.daysInMonth = [];
                const firstDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Lunes como inicio
                const daysInMonth = lastDayOfMonth.getDate();

                for (let i = 0; i < firstDayOfWeek; i++) {
                    this.daysInMonth.push({ day: 0, date: '', available: false });
                }

                for (let day = 1; day <= daysInMonth + 1; day++) {
                    const date = new Date(this.currentYear, this.currentMonth, day + 1).toISOString().split('T')[0];
                    const available = dates.find(d => d.date === date)?.available || false;
                    this.daysInMonth.push({ day, date, available });
                }

                const totalDays = this.daysInMonth.length;
                const daysToAdd = (7 - (totalDays % 7)) % 7;
                for (let i = 0; i < daysToAdd; i++) {
                    this.daysInMonth.push({ day: 0, date: '', available: false });
                }
            },
            error: (err) => console.error('Error al cargar el calendario: ' + (err.error?.message || err.message))
        });
    }

    private updateMonthYear(): void {
        const date = new Date(this.currentYear, this.currentMonth);
        this.currentMonthYear = date.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
        this.canGoToPreviousMonth = !(this.currentYear === new Date().getFullYear() && this.currentMonth === new Date().getMonth());
    }

    previousMonth(): void {
        if (this.currentMonth === 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else {
            this.currentMonth--;
        }
        this.updateMonthYear();
        this.generateCalendar();
    }

    nextMonth(): void {
        const currentDate = new Date();
        const maxMonth = currentDate.getMonth() + 1;
        const maxYear = currentDate.getFullYear();

        if (this.currentMonth === 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else {
            this.currentMonth++;
        }

        if (this.currentYear > maxYear || (this.currentYear === maxYear && this.currentMonth > maxMonth)) {
            this.currentMonth--;
            if (this.currentMonth < 0) {
                this.currentMonth = 11;
                this.currentYear--;
            }
            return;
        }

        this.updateMonthYear();
        this.generateCalendar();
    }

    selectDate(date: string): void {
        if (date >= this.minDate && date <= this.maxDate) {
            this.dateSelected.emit(date);
        } else {
            console.log(`Fecha inválida seleccionada: ${date}, min: ${this.minDate}, max: ${this.maxDate}`);
        }
    }
}