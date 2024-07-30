import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  students: [],
  status: 'idle',
  error: null,
};

// Async thunk for fetching students
export const fetchStudents = createAsyncThunk('students/fetchStudents', async () => {
  const response = await fetch('http://localhost:3000/students');
  return response.json();
});

// Async thunk for adding a student
export const addStudent = createAsyncThunk('students/addStudent', async (newStudent) => {
  const response = await fetch('http://localhost:3000/students', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newStudent),
  });
  return response.json();
});

// Async thunk for updating a student
export const updateStudent = createAsyncThunk('students/updateStudent', async ({ id, ...student }) => {
  const response = await fetch(`http://localhost:3000/students/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(student),
  });
  return response.json();
});

// Async thunk for deleting a student
export const deleteStudent = createAsyncThunk('students/deleteStudent', async (id) => {
  await fetch(`http://localhost:3000/students/${id}`, {
    method: 'DELETE',
  });
  return id;
});

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.students.push(action.payload);
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        const index = state.students.findIndex(student => student.id === action.payload.id);
        if (index !== -1) {
          state.students[index] = action.payload;
        }
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.students = state.students.filter(student => student.id !== action.payload);
      });
  },
});

export default studentsSlice.reducer;
