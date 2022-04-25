import domController from "./domcontroller";
import { todoEntry, noteEntry, checklistEntry } from "./entry";
import project from "./project";

const dataHandler = (() => {
  let projects;
  let currentProjectTitle;

  if (
    !localStorage.getItem("projects") ||
    JSON.parse(localStorage.getItem("projects")).length == 0
  ) {
    projects = [];
    projects.push({ title: "My Project", project: project("My Project") });
    localStorage.setItem("projects", JSON.stringify(projects));
    currentProjectTitle = "My Project";
  } else {
    projects = JSON.parse(localStorage.getItem("projects"));
    currentProjectTitle = projects[0].title;
  }

  const addEntry = (entry, entryType) => {
    switch (entryType) {
      case "todo":
        currentProject().todoEntries.push(entry);
        break;
      case "note":
        currentProject().noteEntries.push(entry);
        break;
      case "checklist":
        currentProject().checklistEntries.push(entry);
        break;
    }
  };

  const addProject = (newTitle) => {
    const newProject = project(newTitle);
    projects.push({ title: newTitle, project: newProject });
    storeProjects();
  };

  const switchProject = (projectTitle) => {
    currentProjectTitle = projectTitle;
    storeProjects();
    domController.renderPage();
  };

  const makeEntryAndAddToCurrentProject = (form, editMode = false) => {
    const formEntries = getFormEntries(form);
    const newEntry = convertFormEntriesToEntry(formEntries);
    const entryType = form.id.slice(0, form.id.indexOf("-"));

    if (editMode) {
      const projectEntries = currentProject()[`${entryType}Entries`];
      const matchingEntry = projectEntries.find((projectEntry) => {
        return projectEntry.title == newEntry.title;
      });

      currentProject()[`${entryType}Entries`].splice(
        projectEntries.indexOf(matchingEntry),
        1
      );
    }

    addEntry(newEntry, entryType);
  };

  const saveEntry = (form, editMode = false) => {
    makeEntryAndAddToCurrentProject(form, editMode);
    storeProjects();
  };

  const convertFormEntriesToEntry = (formEntries) => {
    switch (formEntries.entryType) {
      case "todo":
        return todoEntry({
          title: formEntries["todo-form-title"],
          dueDate: formEntries["todo-form-due-date"],
          description: formEntries["todo-form-description"],
          priority: formEntries["todo-form-priority"],
          completed: false,
        });
      case "note":
        return noteEntry({
          title: formEntries["note-form-title"],
          content: formEntries["note-form-content"],
        });
      case "checklist":
        return checklistEntry({
          title: formEntries["checklist-form-title"],
          checklist: getChecklistMembers(),
        });
    }
  };

  const currentProject = () => {
    const parsedProject = projects.find((project) => {
      return project.title == currentProjectTitle;
    }).project;

    return Object.assign(project(), parsedProject);
  };

  const listProjectEntries = () => {
    const projectEntries = [];
    currentProject().todoEntries.forEach((todoEntry) =>
      projectEntries.push(todoEntry.title)
    );
    currentProject().noteEntries.forEach((noteEntry) =>
      projectEntries.push(noteEntry.title)
    );
    currentProject().checklistEntries.forEach((checklistEntry) =>
      projectEntries.push(checklistEntry.title)
    );
    return projectEntries;
  };

  const getChecklistMembers = () => {
    const checklistForm = document.forms.namedItem("checklist-form");
    const checklistContainer = checklistForm.querySelector(
      "#checklist-form-members-container"
    );
    const checklistMemberElements = checklistContainer.children;
    const checklistMembers = [];

    for (let i = 0; i < checklistMemberElements.length; i++) {
      const checklistEntry = checklistMemberElements[i];
      if (checklistEntry.id === "checklist-form-new-member-container") continue;

      const checklistEntryContent =
        checklistEntry.querySelector('input[type="text"]').value;
      const checklistEntryIsCompleted = checklistEntry.querySelector(
        'input[type="checkbox"]'
      ).checked;

      checklistMembers.push({
        content: checklistEntryContent,
        completed: checklistEntryIsCompleted,
      });
    }
    return checklistMembers;
  };

  const getFormEntries = (form) => {
    const entryType = form.id.slice(0, form.id.indexOf("-"));
    const formData = new FormData(form);
    const formEntries = {};

    for (const [key, value] of formData.entries()) {
      formEntries[key] = value;
    }

    Object.defineProperty(formEntries, "entryType", {
      value: entryType,
      enumerable: true,
    });

    return formEntries;
  };

  const getProjectsFromStorage = () => {
    return JSON.parse(localStorage.getItem("projects"));
  };

  const storeProjects = () => {
    localStorage.setItem("projects", JSON.stringify(projects));
  };

  const getCurrentProjectFromStorage = () => {
    return getProjectsFromStorage().find((project) => {
      return project.title == currentProjectTitle;
    }).project;
  };

  return {
    addProject,
    switchProject,
    currentProject,
    currentProjectTitle,
    projects,
    storeProjects,
    getCurrentProjectFromStorage,
    getProjectsFromStorage,
    listProjectEntries,
    saveEntry,
    makeEntryAndAddToCurrentProject,
  };
})();

export default dataHandler;
