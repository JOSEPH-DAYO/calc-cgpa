import React, { useState } from 'react';
import './App.css';

function App() {
  const [semesters, setSemesters] = useState([{ subjects: [{ name: '', grade: '', unit: '' }] }]);
  const [gpas, setGpas] = useState([]);
  const [cgpa, setCgpa] = useState(null);
  const [remark, setRemark] = useState('');

  const handleInputChange = (semesterIndex, subjectIndex, event) => {
    const { name, value } = event.target;

    // Ensure the unit input only allows positive values
    if (name === 'unit' && value < 0) {
      return;
    }

    const updatedSemesters = semesters.map((semester, sIndex) => {
      if (sIndex === semesterIndex) {
        const updatedSubjects = semester.subjects.map((subject, subIndex) => {
          if (subIndex === subjectIndex) {
            return { ...subject, [name]: value };
          }
          return subject;
        });
        return { ...semester, subjects: updatedSubjects };
      }
      return semester;
    });
    setSemesters(updatedSemesters);
  };

  const handleAddSubject = (semesterIndex) => {
    const updatedSemesters = semesters.map((semester, sIndex) => {
      if (sIndex === semesterIndex) {
        return {
          ...semester,
          subjects: [...semester.subjects, { name: '', grade: '', unit: '' }]
        };
      }
      return semester;
    });
    setSemesters(updatedSemesters);
  };

  const handleRemoveSubject = (semesterIndex, subjectIndex) => {
    const updatedSemesters = semesters.map((semester, sIndex) => {
      if (sIndex === semesterIndex) {
        const updatedSubjects = semester.subjects.filter((_, subIndex) => subIndex !== subjectIndex);
        return { ...semester, subjects: updatedSubjects };
      }
      return semester;
    });
    setSemesters(updatedSemesters);
  };

  const handleAddSemester = () => {
    const newSemester = {
      subjects: [{ name: '', grade: '', unit: '' }] // Ensure each new semester has one subject by default
    };
    setSemesters([...semesters, newSemester]);
  };

  const handleRemoveSemester = (semesterIndex) => {
    setSemesters(semesters.filter((_, index) => index !== semesterIndex));
  };

  const gradeToPoints = (grade) => {
    const gradePoints = { 'A': 5.0, 'B': 4.0, 'C': 3.0, 'D': 2.0, 'E': 1.0, 'F': 0.0 };
    return gradePoints[grade.toUpperCase()] || 0.0;
  };

  const calculateGpa = (grades, units) => {
    const totalPoints = grades.reduce((sum, grade, index) => sum + (grade * units[index]), 0);
    const totalUnits = units.reduce((sum, unit) => sum + unit, 0);
    return totalUnits ? (totalPoints / totalUnits).toFixed(2) : 0;
  };

  const handleCalculateGpa = () => {
    const newGpas = semesters.map((semester) => {
      const grades = semester.subjects.map(subject => gradeToPoints(subject.grade));
      const units = semester.subjects.map(subject => parseFloat(subject.unit) || 0);
      return calculateGpa(grades, units);
    });

    setGpas(newGpas);

    const totalGpa = newGpas.reduce((sum, gpa) => sum + parseFloat(gpa), 0);
    const finalCgpa = (totalGpa / newGpas.length).toFixed(2);
    setCgpa(finalCgpa);

    let remark = '';
    if (finalCgpa >= 4.5) {
      remark = 'You have a First Class';
    } else if (finalCgpa >= 3.5) {
      remark = 'You have a Second Class Upper';
    } else if (finalCgpa >= 2.5) {
      remark = 'You have a Second Class Lower';
    } else if (finalCgpa >= 1.5) {
      remark = 'You have a Third Class';
    } else {
      remark = 'You have a Pass';
    }
    setRemark(remark);
  };

  const groupedSemesters = semesters.reduce((acc, semester, index) => {
    const year = Math.floor(index / 2) + 1;
    if (!acc[year]) acc[year] = [];
    acc[year].push(semester);
    return acc;
  }, {});

  return (
    <div className="App">
      <h1>CGPA Calculator</h1>
      {Object.keys(groupedSemesters).map(year => (
        <div key={year} className="year">
          <h2>Year {year}</h2>
          <div className="semesters">
            {groupedSemesters[year].map((semester, semesterIndex) => (
              <div key={semesterIndex} className="semester">
                <h3>Semester {semesterIndex + 1}</h3>
                {semester.subjects.map((subject, subjectIndex) => (
                  <div key={subjectIndex} className="subject">
                    <div className="subject-label">Subject {subjectIndex + 1}</div>
                    <input
                      type="text"
                      name="name"
                      value={subject.name}
                      onChange={(e) => handleInputChange((year - 1) * 2 + semesterIndex, subjectIndex, e)}
                      placeholder="Subject Name"
                    />
                    <select
                      name="grade"
                      value={subject.grade}
                      onChange={(e) => handleInputChange((year - 1) * 2 + semesterIndex, subjectIndex, e)}
                    >
                      <option value="">Select Grade</option>
                      <option value="A">A (70-100)</option>
                      <option value="B">B (60-69.99)</option>
                      <option value="C">C (50-59.99)</option>
                      <option value="D">D (45-49.99)</option>
                      <option value="E">E (40-44.99)</option>
                      <option value="F">F (0-39.99)</option>
                    </select>
                    <input
                      type="number"
                      name="unit"
                      value={subject.unit}
                      onChange={(e) => handleInputChange((year - 1) * 2 + semesterIndex, subjectIndex, e)}
                      placeholder="Unit"
                      min="0"
                      className="unit"
                    />
                    <button className="remove-subject" onClick={() => handleRemoveSubject((year - 1) * 2 + semesterIndex, subjectIndex)}>Remove</button>
                    <button className="remove-semester" onClick={() => handleRemoveSemester((year - 1) * 2 + semesterIndex)}>Remove Semester</button>
                  </div>
                ))}
                <button className="add-subject" onClick={() => handleAddSubject((year - 1) * 2 + semesterIndex)}>Add Subject</button>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="button-container">
        <button className="large" onClick={handleAddSemester}>Add Semester</button>
        <button className="large" onClick={handleCalculateGpa}>Calculate GPAs and CGPA</button>

      </div>
      {gpas.length > 0 && (
        <div>
          <h2>GPA(S)</h2>
          {gpas.map((gpa, index) => (
            <p key={index} className="gpa">Semester {index + 1} GPA: {gpa}</p>
          ))}
        </div>
      )}
      {cgpa && (
        <div className="cgpa-container">
          <h2 className="cgpa">CGPA: {cgpa}</h2>
          <p className="remark">{remark}</p>
        </div>
      )}
    </div>
  );
}

export default App;