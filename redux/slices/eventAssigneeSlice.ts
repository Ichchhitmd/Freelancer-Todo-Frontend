import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Assignee {
  assignedBy: string;
  assignedContactNumber: number | null;
}

interface AssigneesState {
  assignees: Assignee[];
}

const initialState: AssigneesState = {
  assignees: [],
};

const assigneesSlice = createSlice({
  name: 'assignees',
  initialState,
  reducers: {
    setAssignees: (state, action: PayloadAction<Assignee[]>) => {
      // Extract unique assignees based on assignedBy
      const uniqueAssignees: Assignee[] = [];

      action.payload.forEach((event) => {
        if (
          event.assignedBy &&
          event.assignedContactNumber !== undefined &&
          !uniqueAssignees.some((a) => a.assignedBy === event.assignedBy)
        ) {
          uniqueAssignees.push({
            assignedBy: event.assignedBy,
            assignedContactNumber: event.assignedContactNumber,
          });
        }
      });

      state.assignees = uniqueAssignees;
    },
  },
});

export const { setAssignees } = assigneesSlice.actions;
export default assigneesSlice.reducer;
