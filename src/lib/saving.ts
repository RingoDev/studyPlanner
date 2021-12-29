import { CurriculumType, Grade } from "../types/types";

export interface SavedCurriculum {
  semester: {
    customEcts: number;
    courses: {
      id: string;
      grade?: Grade;
    }[];
  }[];
}

export function createSaveObject(curriculum: CurriculumType): string {
  const toSave: SavedCurriculum = {
    semester: curriculum.semesters.map((s) => ({
      customEcts: s.customEcts,
      courses: s.courses.map((c) => ({ id: c.id, grade: c.grade })),
    })),
  };

  return JSON.stringify(toSave);
}

export function loadSaveObject(saved: string): SavedCurriculum {
  return JSON.parse(saved) as SavedCurriculum;
}
