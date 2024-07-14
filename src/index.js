import { fetchSchedule } from './schedule.js';
import { getShaOfFile } from './schedule.js';
import { updateSchedule } from './schedule.js';

document.addEventListener('DOMContentLoaded',async () => {
    const mainContent = document.getElementById('main-content');
    let selectedExamIndex = -1;
    let existingExams = await fetchSchedule();
    attachFormEventListeners();

    function attachFormEventListeners() {
        const form = document.getElementById('decision-form');
        const resultDiv = document.getElementById('result');
        const submitButton = document.getElementById('submit-button');
        const clearButton = document.getElementById('clear-button');

    submitButton.addEventListener('click', function(event){
        event.preventDefault();

        const subject = form['subject'].value;
        const group = form['group'].value;
        const examDate = form['exam-date'].value;
        const examTime = form['exam-time'].value;
        const selectedDateTime = new Date(`${examDate}T${examTime}`);

        const subjectRegex = /[а-яА-ЯЁё]/;
        if (!subjectRegex.test(subject)) {
            resultDiv.textContent = 'Название дисциплины должно быть на русском языке.';
            return;
        }
        
        const groupRegex = /^\d{2}[а-яА-Я]{1,3}\d$/;
        if (!groupRegex.test(group)) {
            resultDiv.textContent = 'Группа введенна некорректно(пример корректного ввода "21ВИ1", "22ВВП2").';
            return;
        }
        
        const selectedMonth = selectedDateTime.getMonth(); 
        const selectedYear = selectedDateTime.getFullYear();
        if (selectedMonth !== 5 || selectedYear !== 2024) { 
            resultDiv.textContent = 'Экзамен должен быть назначен на июнь 2024 года.';
            return;
        }
        const selectedHour = selectedDateTime.getHours();
        if (selectedHour < 8 || selectedHour > 17) {
            resultDiv.textContent = 'Время экзамена должно быть с 8:00 до 17:00.';
            return;
        }

        let conflictDateTime = false;
        let conflictSubject = false;

        existingExams.forEach((exam, index) => {
            const examDateTime = new Date(`${exam.date}T${exam.time}`);
            const existingSubject = exam.subject;

            if (existingSubject === subject && exam.group === group) {
                conflictSubject = true;
                selectedExamIndex = index;
            }

            if (selectedDateTime.getTime() === examDateTime.getTime() && exam.group === group) {
                conflictDateTime = true;
            }
        });

        if (conflictSubject && selectedExamIndex === -1) {
            resultDiv.textContent = 'Экзамен по дисциплине уже назначен.';
        } else if (conflictDateTime) {
            resultDiv.textContent = 'На это время уже назначен другой экзамен. Пожалуйста, выберите другое время.';
        } else {
            resultDiv.textContent = 'Выбранное время свободно. Экзамен можно назначить на это время.';
            addOrUpdateExam(subject, group, examDate, examTime);
        }
        return false;
    });
    
    clearButton.addEventListener('click', () => {
        console.log("Form clear event listener triggered");
        form['subject'].value = '';
        form['group'].value = '';
        form['exam-date'].value = '';
        form['exam-time'].value = '';
        resultDiv.textContent = '';
    });
    }

    async function addOrUpdateExam(subject, group, date, time) {
        if (selectedExamIndex >= 0) {
            existingExams[selectedExamIndex].date = date;
            existingExams[selectedExamIndex].time = time;
            document.getElementById('result').textContent = 'Экзамен по дисциплине переназначен.';
        } else {
            existingExams.push({ subject, group, date, time });
        }
        selectedExamIndex = -1;
        await updateSchedule(existingExams);
        existingExams = await fetchSchedule();
    }
    
    function sortExams(exams) {
        return exams.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
    }
    
    document.getElementById('home-link').addEventListener('click', (e) => {
        e.preventDefault();
        displayContent(renderHomeContent());
    });

    document.getElementById('subjects-link').addEventListener('click', (e) => {
        e.preventDefault();
        displayContent(renderSubjectsContent());
    });

    document.getElementById('dates-link').addEventListener('click', (e) => {
        e.preventDefault();
        displayContent(renderDatesContent());
    });

    document.getElementById('groups-link').addEventListener('click', (e) => {
        e.preventDefault();
        displayContent(renderGroupsContent());
    });

    document.getElementById('schedule-link').addEventListener('click', (e) => {
        e.preventDefault();
        displayContent(renderScheduleContent());
    });

    function displayContent(content) {
        mainContent.innerHTML = content;
        const form = document.getElementById('decision-form');
        if (form){
            attachFormEventListeners();
        }
    }

    function renderHomeContent() {
        return `
            <h2>Система назначения экзаменов</h2>
            <form id="decision-form">
                <label for="subject">Название дисциплины:</label>
                <input type="text" id="subject" name="subject" required>

                <label for="group">Группа:</label>
                <input type="text" id="group" name="group" required>
                
                <label for="exam-date">Дата экзамена:</label>
                <input type="date" id="exam-date" name="exam-date" required>
                
                <label for="exam-time">Время экзамена:</label>
                <input type="time" id="exam-time" name="exam-time" required>

                <button class="btn-new" type="button" id="submit-button">Назначить экзамен</button>
                <button class="btn-new" type="button" id="clear-button">Очистить</button>
            </form>
            <div id="result"></div>
        `;
    }

    function renderSubjectsContent() {
        let subjects = existingExams.map(exam => exam.subject);
        return `
            <h2>Дисциплины</h2>
            <table>
                <thead>
                    <tr>
                        <th>Название дисциплины</th>
                    </tr>
                </thead>
                <tbody>
                    ${[...new Set(subjects)].map(subject => `<tr><td>${subject}</td></tr>`).join('')}
                </tbody>
            </table>
        `;
    }

    function renderDatesContent() {
        let dates = existingExams.map(exam => exam.date);
        return `
            <h2>Даты экзаменов</h2>
            <table>
                <thead>
                    <tr>
                        <th>Дата</th>
                    </tr>
                </thead>
                <tbody>
                    ${[...new Set(dates)].map(date => `<tr><td>${date}</td></tr>`).join('')}
                </tbody>
            </table>
        `;
    }

    function renderGroupsContent() {
        let groups = existingExams.map(exam => exam.group);
        return `
            <h2>Группы</h2>
            <table>
                <thead>
                    <tr>
                        <th>Группа</th>
                    </tr>
                </thead>
                <tbody>
                    ${[...new Set(groups)].map(group => `<tr><td>${group}</td></tr>`).join('')}
                </tbody>
            </table>
        `;
    }

    function renderScheduleContent() {
        existingExams = sortExams(existingExams);
        return `
            <h2>Расписание экзаменов</h2>
            <table>
                <thead>
                    <tr>
                        <th>Дата</th>
                        <th>Время</th>
                        <th>Дисциплина</th>
                        <th>Группа</th>
                    </tr>
                </thead>
                <tbody>
                    ${existingExams.map(exam => `
                        <tr>
                            <td>${exam.date}</td>
                            <td>${exam.time}</td>
                            <td>${exam.subject}</td>
                            <td>${exam.group}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
});





