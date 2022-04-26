import dataHandler from './dataHandler'
import elementBuilder from './elementBuilder'

const domController = (() => {
  const todoList = document.querySelector('.todo-list')
  const noteList = document.querySelector('.note-list')
  const checklistContainer = document.querySelector('.checklist-container')
  const formWrapper = document.querySelector('.entry-form-wrapper')
  const projectSelector = document.querySelector('#current-project-select')

  const renderPage = () => {
    const todoListElements = elementBuilder.todoListElements()
    const noteListElements = elementBuilder.noteListElements()
    const checklistContainerElements =
      elementBuilder.checklistContainerElements()

    renderList(todoList, todoListElements)
    renderList(noteList, noteListElements)
    renderList(checklistContainer, checklistContainerElements)
  }

  const renderList = (list, listElements) => {
    list.innerHTML = ''
    listElements.forEach(listElement => list.append(listElement))
  }

  const listenForFormInput = () => {
    const formButtons = document.querySelectorAll('form button')
    const checklistAddButton = document.querySelector(
      '.checklist-form-new-member-button'
    )
    const titleInputs = formWrapper.querySelectorAll("input[name*='title']")

    titleInputs.forEach((titleInput) =>
      titleInput.addEventListener('input', (event) => {
        const currentForm = event.target.form
        const currentTitle = currentForm.querySelector("input[name*='title']")
        if (dataHandler.listProjectEntries().includes(currentTitle.value)) {
          currentTitle.setCustomValidity('Title already used.')
          currentTitle.reportValidity()
        } else {
          currentTitle.setCustomValidity('')
          currentTitle.reportValidity()
        }
      })
    )

    formWrapper.addEventListener('click', (event) => {
      if (event.target !== formWrapper) return
      closeModals()
    })

    formButtons.forEach((button) =>
      button.addEventListener('click', (event) => {
        const currentForm = event.target.form

        if (!currentForm.checkValidity()) return currentForm.reportValidity()

        if (currentForm.id === 'project-form') {
          const title = currentForm.querySelector('#project-form-title').value
          dataHandler.addProject(title)
          addProjectSelection(title)
          dataHandler.switchProject(title)
          switchProjectSelection(title)
          renderPage()
          return closeModals()
        }

        if (currentForm.editMode) {
          dataHandler.saveEntry(currentForm, true)
          renderPage()
          return closeModals()
        }

        dataHandler.saveEntry(currentForm)
        renderPage()
        closeModals()
      })
    )

    checklistAddButton.addEventListener('click', () => {
      addChecklistMember()
    })
  }

  const switchProjectSelection = (projectTitle) => {
    projectSelector.value = projectTitle
  }

  const addChecklistMember = () => {
    const container = document.getElementById(
      'checklist-form-members-container'
    )
    const checklistMember = document.createElement('div')
    checklistMember.classList.add('checklist-form-member')

    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'

    const content = document.createElement('input')
    content.required = true
    content.type = 'text'
    content.classList.add('checklist-form-member-content')

    checklistMember.append(checkbox, content)
    container.append(checklistMember)
  }

  const addProjectSelection = (projectTitle) => {
    projectSelector.append(elementBuilder.projectSelection(projectTitle))
  }

  const removeProjectSelection = (projectTitle) => {
    const element = [...projectSelector.options].find(
      (option) => option.value === projectTitle
    )
    element.remove()
  }

  const listenForProjectDelete = () => {
    const projectDeleteButton = document.querySelector(
      '.header-project-delete-button'
    )
    projectDeleteButton.addEventListener('click', () => {
      const projectTitle = projectSelector.value
      if (projectTitle === 'My Project') { return window.alert('Cannot delete default project.') }
      if (window.confirm('Are you sure you want to delete this project?')) {
        const project = dataHandler.projects.find(
          (project) => project.title === projectTitle
        )
        dataHandler.projects.splice(dataHandler.projects.indexOf(project), 1)
        removeProjectSelection(projectTitle)
        dataHandler.switchProject('My Project')
      }
    })
  }

  const closeModals = () => {
    const checklistFormMembers = document.querySelectorAll(
      '.checklist-form-member'
    )
    checklistFormMembers.forEach((member) => member.remove())

    formWrapper.classList.add('form-hidden')
    for (const form of document.forms) {
      form.classList.add('form-hidden')
      form.reset()
    }
  }

  const openModal = (form, editMode = false, editValues = null) => {
    form.editMode = editMode
    if (editMode) populateEditForm(form, editValues)

    if (form.id === 'todo-form' && !editMode) setTodoMinDueDateToNow()

    const checkboxFormMembersContainer = form.querySelector(
      '#checklist-form-members-container'
    )
    if (
      form.id === 'checklist-form' &&
      checkboxFormMembersContainer.children.length < 1
    ) {
      addChecklistMember()
    }

    formWrapper.classList.remove('form-hidden')
    form.classList.remove('form-hidden')
  }

  const listenForNewEntry = () => {
    dataHandler.storeProjects()
    const newButtons = document.querySelectorAll('.new-entry-button')
    newButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const elementClass = event.target.classList[0]
        const formNamePrefix = elementClass.slice(0, elementClass.indexOf('-'))
        const formName = `${formNamePrefix}-form`
        const formElement = document.forms.namedItem(formName)

        if (event.target.classList.contains('header-project-new-button')) {
          return openModal(document.forms.namedItem('project-form'))
        }

        openModal(formElement, false)
      })
    })
  }

  const listenForProjectSwitch = () => {
    const selector = document.getElementById('current-project-select')

    selector.addEventListener('change', (e) => {
      dataHandler.switchProject(e.target.value)
    })
  }

  const listenForFormClose = () => {
    const formCloseButton = document.querySelector('.form-close-button')
    formCloseButton.addEventListener('click', () => closeModals())
  }

  const activateListeners = () => {
    populateProjectSelectList(dataHandler.projects)
    listenForNewEntry()
    listenForFormInput()
    listenForFormClose()
    listenForProjectSwitch()
    listenForProjectDelete()
    renderPage()
  }

  const populateProjectSelectList = (projects) => {
    const selector = document.getElementById('current-project-select')

    projects.forEach((project) => {
      const element = elementBuilder.projectSelection(project.title)
      selector.append(element)
    })
    selector.value = dataHandler.currentProjectTitle
  }

  const populateEditForm = (form, editValues) => {
    const todoTitleElement = form.querySelector('#todo-form-title')
    const todoDescElement = form.querySelector('#todo-form-description')
    const todoDueDateElement = form.querySelector('#todo-form-due-date')
    const todoPriority = form.querySelectorAll(
      'input[name="todo-form-priority"]'
    )
    const noteTitleElement = form.querySelector('#note-form-title')
    const noteContentElement = form.querySelector('#note-form-content')
    const checklistTitleElement = form.querySelector(
      '#checklist-form-title'
    )
    const checklistElement = form.querySelector(
      '#checklist-form-members-container'
    )

    switch (editValues.entryType) {
      case 'todo':
        todoTitleElement.value = editValues.title
        todoDescElement.value = editValues.description
        todoDueDateElement.value = editValues.dueDate

        todoPriority.forEach((priority) => (priority.checked = false));
        [...todoPriority].find((element) => {
          return element.id === `todo-form-radio-${editValues.priority}`
        }).checked = true

        break
      case 'note':
        noteTitleElement.value = editValues.title
        noteContentElement.value = editValues.content
        break
      case 'checklist':
        checklistTitleElement.value = editValues.title
        checklistElement.innerHTML = ''
        elementBuilder.checklistFormMembers(editValues.checklist)
        break
    }
  }

  const setTodoMinDueDateToNow = () => {
    const now = new Date()
    const year = now.getFullYear()
    let month = now.getMonth() + 1
    let day = now.getDate()
    let hours = now.getHours()
    let minutes = now.getMinutes()

    const dateInput = document.forms
      .namedItem('todo-form')
      .querySelector('#todo-form-due-date')

    if (month < 10) month = '0' + month
    if (day < 10) day = '0' + day
    if (hours < 10) hours = '0' + hours
    if (minutes < 10) minutes = '0' + minutes

    dateInput.min = `${year}-${month}-${day}T${hours}:${minutes}`
    dateInput.value = `${year}-${month}-${day}T${hours}:${minutes}`
  }

  return {
    addProjectSelection,
    activateListeners,
    renderPage,
    checklistContainer,
    openModal,
    populateProjectSelectList
  }
})()

export default domController
