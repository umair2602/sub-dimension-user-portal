import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  projects: [],
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
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

export const { addProjects, removeProjects } = projectsSlice.actions;

export default projectsSlice.reducer;
