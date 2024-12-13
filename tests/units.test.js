const request = require("supertest");
const express = require("express");
const router = require("../Routes/UnitRoute"); // Import your router
const Unit = require("../Models/Unit");
const Course = require("../Models/Course");

jest.mock("../Models/Unit");
jest.mock("../Models/Course");

const app = express();
app.use(express.json());
app.use("/", router);

describe("Unit Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /add_unit", () => {
    it("should add a new unit and return it", async () => {
      const mockUnit = {
        idCourse: "courseId123",
        title: "New Unit",
        save: jest.fn(),
      };
      Unit.mockImplementation(() => mockUnit);

      mockUnit.save.mockResolvedValue({
        idCourse: "courseId123",
        title: "New Unit",
      });

      const res = await request(app)
        .post("/add_unit")
        .send({ idCourse: "courseId123", title: "New Unit" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        idCourse: "courseId123",
        title: "New Unit",
      });
    });
  });

  describe("GET /get_unit/:unitId", () => {
    it("should fetch a unit by ID", async () => {
      const mockUnit = {
        _id: "unit123",
        idCourse: "course123",
        title: "Mock Unit",
      };

      Unit.findById.mockResolvedValue(mockUnit);

      const res = await request(app).get("/get_unit/unit123");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUnit);
    });
  });

  describe("DELETE /delete_unit/:unitId", () => {
    it("should delete a unit by ID and return it", async () => {
      const mockUnit = {
        _id: "unit123",
        idCourse: "course123",
        title: "Mock Unit",
      };

      Unit.findByIdAndDelete.mockResolvedValue(mockUnit);

      const res = await request(app).delete("/delete_unit/unit123");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUnit);
    });
  });

  describe("PUT /update_unit/:unitId", () => {
    it("should update a unit by ID and return the updated unit", async () => {
      const mockUnit = {
        _id: "unit123",
        idCourse: "course123",
        title: "Updated Unit",
      };

      Unit.findByIdAndUpdate.mockResolvedValue(mockUnit);

      const res = await request(app)
        .put("/update_unit/unit123")
        .send({ idCourse: "course123", title: "Updated Unit" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUnit);
    });
  });

  describe("GET /get_units", () => {
    it("should fetch all units with course names", async () => {
      const mockUnits = [
        { _id: "unit1", idCourse: "course1", title: "Unit 1", lessons: [] },
        { _id: "unit2", idCourse: "course2", title: "Unit 2", lessons: [] },
      ];

      const mockCourses = [
        { _id: "course1", title: "Course 1" },
        { _id: "course2", title: "Course 2" },
      ];

      Unit.find.mockResolvedValue(mockUnits);
      Course.find.mockResolvedValue(mockCourses);

      const res = await request(app).get("/get_units");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        {
          idUnit: "unit1",
          unitTitle: "Unit 1",
          nbLessons: 0,
          idCourse: "course1",
          courseTitle: "Course 1",
        },
        {
          idUnit: "unit2",
          unitTitle: "Unit 2",
          nbLessons: 0,
          idCourse: "course2",
          courseTitle: "Course 2",
        },
      ]);
    });
  });
  /*
  describe("GET /getUnitsWithIdCourse/:courseID", () => {
    it("should fetch units by course ID", async () => {
      const mockUnits = [
        { _id: "unit1", idCourse: "course123", title: "Unit 1", lessons: [] },
      ];

      Unit.find.mockResolvedValue(mockUnits);

      const res = await request(app).get("/getUnitsWithIdCourse/course123");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUnits);
    });
  });
    
    */
});
