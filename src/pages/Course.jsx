import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import CourseNavigetionSideMenu from "../components/CourseNavigetionSideMenu";
// import { Course as CourseClass } from "../components/FirebaseContext";
import { useHref, useNavigate, useParams } from "react-router-dom";
import VideoContent from "../components/Personal/VideoContent";
import {
  Course as CourseClass,
  LoginContext,
  saveLastComponent,
} from "../components/FirebaseContext";
import ContentFactory from "../components/Personal/ContentFactory";

export default function Course() {
  const user = React.useContext(LoginContext);

  const [course, setCourse] = useState(null);
  const [currentComponent, setCurrentComponent] = useState(null);
  const [currentComponentId, setCurrentComponentId] = useState("");
  const navigate = useNavigate();
  let { courseId, componentId } = useParams();

  useEffect(() => {
    if (
      course &&
      typeof currentComponentId == typeof "" &&
      currentComponentId.length > 0
    ) {
      course.componentsIterator((component) => {
        if (component.id == currentComponentId) {
          setCurrentComponent(component);
        }
      });
    }
  }, [currentComponentId, course]);
  useEffect(() => {
    if (!user.creator && currentComponent)
      saveLastComponent(
        currentComponent.chapter.course.id,
        currentComponent.id
      );
  }, [currentComponent]);

  if (!courseId) {
    navigate("/404");
  }

  if (!course || courseId != course.id) {
    CourseClass.buildCourse(courseId).then((data) => setCourse(data));
    return <h6>loading</h6>;
  }

  if (componentId != currentComponentId) setCurrentComponentId(componentId);

  function handleNext() {
    let next = getNextComponent(currentComponent);
    if (next) {
      let newUrl = `/course/${course.id}/${next.id}`;
      navigate(newUrl);
    }
  }
  function handlePrev() {
    let prev = getPrevComponent(currentComponent);
    if (prev) {
      let newUrl = `/course/${course.id}/${prev.id}`;
      navigate(newUrl);
    }
  }
  return (
    <Box sx={{ marginTop: "1.5rem" }}>
      <Typography component="h1" variant="h4" align="" margin="1rem">
        {course.name}
      </Typography>
      <CourseNavigetionSideMenu course={course} lessonsLearned={[]} />
      {currentComponent ? (
        <>
          <Typography component="h4" variant="h4" align="center" margin="">
            {currentComponent.name}
          </Typography>

          <ContentFactory
            type={currentComponent.type}
            content={currentComponent.content}
            url={currentComponent.url}
          />
          <Box display="flex" justifyContent="center" alignItems="center">
            <Button variant="outlined" onClick={handlePrev}>
              {`<`} הקודם
            </Button>
            <Button variant="outlined" onClick={handleNext}>
              הבא {`>`}
            </Button>
          </Box>
        </>
      ) : (
        <></>
      )}
    </Box>
  );
}

function getPrevComponent(current) {
  let course = current.chapter.course;
  let arr = [];
  course.chapters.forEach((chapter) => {
    chapter.components.forEach((component) => arr.push(component));
  });
  let nextIndex = arr.indexOf(current) - 1;
  return arr[nextIndex];
}

function getNextComponent(current) {
  let course = current.chapter.course;
  let arr = [];
  course.chapters.forEach((chapter) => {
    chapter.components.forEach((component) => arr.push(component));
  });
  let nextIndex = arr.indexOf(current) + 1;
  return arr[nextIndex];
}
