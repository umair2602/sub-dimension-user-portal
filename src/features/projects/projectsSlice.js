import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    projectName: "",
    companyName: "",
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

    addProjects: (state, action) => {
      const project = {
        ...{
          _id: nanoid(),
        },
        ...action.payload,
      };

      state.projects.unshift(project);
    },
    removeProjects: (state, action) => {
      state.projects = state.projects.filter((project) => project._id !== action.payload);
    },
  },
});

export const {
  updateFormData,
  setInputError,
  clearInputError,
  resetExceptProjects,
  resetStore,
  addProjects,
  removeProjects,
} = projectsSlice.actions;

export default projectsSlice.reducer;
