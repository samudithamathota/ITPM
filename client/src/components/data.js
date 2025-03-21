import React, { useState } from "react";

function App() {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [activities, setActivities] = useState([]);

  const [teacherName, setTeacherName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentAmount, setStudentAmount] = useState("");
  const [buildingInput, setBuildingInput] = useState("");
  const [roomName, setRoomName] = useState("");
  const [roomCapacity, setRoomCapacity] = useState("");
  const [activityTeacher, setActivityTeacher] = useState("");
  const [activityStudent, setActivityStudent] = useState("");
  const [subject, setSubject] = useState("");

  // Add state for activeTab
  const [activeTab, setActiveTab] = useState("Teachers");

  // Add methods for each section
  const addTeacher = () => {
    if (teacherName) {
      setTeachers([...teachers, { name: teacherName }]);
      setTeacherName("");
    }
  };

  const addSubject = () => {
    if (subjectName) {
      setSubjects([...subjects, { name: subjectName }]);
      setSubjectName("");
    }
  };

  const addStudent = () => {
    if (studentName && studentAmount) {
      setStudents([
        ...students,
        { year_name: studentName, num_students: studentAmount },
      ]);
      setStudentName("");
      setStudentAmount("");
    }
  };

  const addBuilding = () => {
    if (buildingInput) {
      setBuildings([...buildings, { name: buildingInput }]);
      setBuildingInput("");
    }
  };

  const addRoom = () => {
    if (roomName && roomCapacity) {
      setRooms([...rooms, { name: roomName, capacity: roomCapacity }]);
      setRoomName("");
      setRoomCapacity("");
    }
  };

  const addActivity = () => {
    if (activityTeacher && activityStudent && subject) {
      setActivities([
        ...activities,
        {
          teach_name: activityTeacher,
          subj_name: subject,
          year_name: activityStudent,
        },
      ]);
      setActivityTeacher("");
      setActivityStudent("");
      setSubject("");
    }
  };

  return (
    <div className="App">
      <header>
        <h1>FET Time Tables</h1>
      </header>
      <div id="mainForm">
        <fieldset>
          <legend>Semester</legend>

          <div className="tabs">
            <button onClick={() => setActiveTab("Teachers")}>Teachers</button>
            <button onClick={() => setActiveTab("Subjects")}>Subjects</button>
            <button onClick={() => setActiveTab("Students")}>Students</button>
            <button onClick={() => setActiveTab("Space")}>Space</button>
            <button onClick={() => setActiveTab("Activities")}>
              Activities
            </button>
          </div>

          <div className="tab_content">
            {/* Teachers Tab */}
            {activeTab === "Teachers" && (
              <div>
                <form>
                  <label>Teacher name:</label>
                  <input
                    type="text"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    required
                  />
                  <button type="button" onClick={addTeacher}>
                    Add
                  </button>
                </form>
                <ul>
                  {teachers.map((teacher, index) => (
                    <li key={index}>
                      {teacher.name}
                      <button>Edit</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Subjects Tab */}{" "}
            {activeTab === "Subjects" && (
              <div>
                <form>
                  <label>Subject name:</label>
                  <input
                    type="text"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    required
                  />
                  <button type="button" onClick={addSubject}>
                    Add
                  </button>
                </form>
                <ul>
                  {subjects.map((subject, index) => (
                    <li key={index}>
                      {subject.name}
                      <button>Edit</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Students Tab */}{" "}
            {activeTab === "Students" && (
              <div>
                <form>
                  <label>Student name:</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                  />
                  <label>Student amount:</label>
                  <input
                    type="number"
                    value={studentAmount}
                    onChange={(e) => setStudentAmount(e.target.value)}
                    required
                  />
                  <button type="button" onClick={addStudent}>
                    Add
                  </button>
                </form>
                <ul>
                  {students.map((student, index) => (
                    <li key={index}>
                      {student.year_name} - {student.num_students}
                      <button>Edit</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Space Tab */}{" "}
            {activeTab === "Space" && (
              <div>
                <form>
                  <label>Building:</label>
                  <input
                    type="text"
                    value={buildingInput}
                    onChange={(e) => setBuildingInput(e.target.value)}
                    required
                  />
                  <button type="button" onClick={addBuilding}>
                    Add
                  </button>
                </form>
                <ul>
                  {buildings.map((building, index) => (
                    <li key={index}>
                      {building.name}
                      <button>Edit</button>
                      <button>Delete</button>
                    </li>
                  ))}
                </ul>

                <form>
                  <label>Room name:</label>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    required
                  />
                  <label>Capacity:</label>
                  <input
                    type="number"
                    value={roomCapacity}
                    onChange={(e) => setRoomCapacity(e.target.value)}
                    required
                  />
                  <button type="button" onClick={addRoom}>
                    Add
                  </button>
                </form>
                <ul>
                  {rooms.map((room, index) => (
                    <li key={index}>
                      {room.name} - {room.capacity}
                      <button>Edit</button>
                      <button>Delete</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Activities Tab */}{" "}
            {activeTab === "Activities" && (
              <div>
                <form>
                  <label>Teacher:</label>
                  <select
                    value={activityTeacher}
                    onChange={(e) => setActivityTeacher(e.target.value)}
                  >
                    {teachers.map((teacher, index) => (
                      <option key={index} value={teacher.name}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                  <label>Student:</label>
                  <select
                    value={activityStudent}
                    onChange={(e) => setActivityStudent(e.target.value)}
                  >
                    {students.map((student, index) => (
                      <option key={index} value={student.year_name}>
                        {student.year_name}
                      </option>
                    ))}
                  </select>
                  <label>Subject:</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    {subjects.map((subject, index) => (
                      <option key={index} value={subject.name}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                  <button type="button" onClick={addActivity}>
                    Save Activity
                  </button>
                </form>
                <ul>
                  {activities.map((activity, index) => (
                    <li key={index}>
                      {activity.teach_name} - {activity.subj_name} -{" "}
                      {activity.year_name}
                      <button>Edit</button>
                      <button>Delete</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </fieldset>
      </div>
    </div>
  );
}

export default App;
