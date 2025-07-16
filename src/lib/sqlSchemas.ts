export const sqlSchemas = {
  graduates: {
    columns: [
      { name: 'id', type: 'uuid' },
      { name: 'student_id', type: 'varchar' },
      { name: 'name', type: 'varchar' },
      { name: 'cohort_year', type: 'int2' },
      { name: 'gpa', type: 'numeric' },
      { name: 'graduation_date', type: 'date' },
      { name: 'study_duration', type: 'numeric' },
      { name: 'thesis_duration', type: 'int2' },
      { name: 'created_at', type: 'timestamp' },
      { name: 'updated_at', type: 'timestamp' },
      { name: 'deleted_at', type: 'timestamp' },
    ],
  },
  tracer_studies: {
    columns: [
      { name: 'id', type: 'uuid' },
      { name: 'student_id', type: 'varchar' },
      { name: 'thesis_defense_date', type: 'date' },
      { name: 'employment_status', type: 'varchar' },
      { name: 'work_province', type: 'varchar' },
      { name: 'income', type: 'numeric' },
      { name: 'regional_min_wage', type: 'numeric' },
      { name: 'waiting_time', type: 'int2' },
      { name: 'workplace', type: 'text' },
      { name: 'created_at', type: 'timestamp' },
      { name: 'updated_at', type: 'timestamp' },
      { name: 'deleted_at', type: 'timestamp' },
    ],
  },
};
