import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    project_name: "",
    company_name: "",
    client: "",
    vessel: "",
    details: "",
  },
  inputErrors: {},
  projects: [],
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    updateFormData: (state, action) => {
      const { name, value } = action.payload;
      state.formData[name] = value;
    },
    setInputError: (state, action) => {
      const { name, error } = action.payload;
      state.inputErrors[name] = error;
    },
    clearInputError: (state, action) => {
      const { name } = action.payload;
      delete state.inputErrors[name];
    },
    resetExceptProjects: (state, action) => {
      Object.keys(initialState).forEach((key) => {
        if (key !== "projects") {
          state[key] = initialState[key];
        }
      });
    },
    resetStore: () => initialState,

    addExistingProjects: (state, action) => {
      state.projects = action.payload;
    },
    addProject: (state, action) => {
      const project = action.payload;
      state.projects.push(project);
    },
    removeProjects: (state, action) => {
      state.projects = state.projects.filter((project) => project.id !== action.payload);
    },
  },
});

export const {
  updateFormData,
  setInputError,
  clearInputError,
  resetExceptProjects,
  resetStore,
  addExistingProjects,
  addProject,
  removeProjects,
} = projectsSlice.actions;

export default projectsSlice.reducer;
