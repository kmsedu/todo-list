import domController from './domController'
import dataHandler from './dataHandler'
import { format } from 'date-fns'

const elementBuilder = (() => {
  const todoListElements = () => {
    const elements = []
    for (const todoEntry of dataHandler.currentProject().todoEntries) {
      const wrapper = document.createElement('li')
      wrapper.classList.add('todo-entry')
      todoEntry.completed
        ? wrapper.classList.add('todo-completed')
        : wrapper.classList.remove('todo-completed')

      wrapper.addEventListener('click', (e) => {
        const isDeleteButton = !!e.target.classList.contains(
          'todo-entry-delete-button'
        )
        if (isDeleteButton) return
        const isCompleteButton = !!e.target.classList.contains(
          'todo-entry-complete-button'
        )
        if (isCompleteButton) return

        const form = document.forms.namedItem('todo-form')
        domController.openModal(form, true, todoEntry)
      })
      wrapper.addEventListener('mouseenter', e => {
        const deleteButton = e.target.querySelector('.todo-entry-delete-button')

        completeButton.classList.remove('button-hidden')
        deleteButton.classList.remove('button-hidden')
      })

      wrapper.addEventListener('mouseleave', e => {
        const deleteButton = e.target.querySelector('.todo-entry-delete-button')

        completeButton.classList.add('button-hidden')
        deleteButton.classList.add('button-hidden')
      })

      const priorityMarker = document.createElement('div')
      priorityMarker.classList.add(`priority-${todoEntry.priority}`)

      const title = document.createElement('h3')
      title.classList.add('todo-entry-title')
      title.innerText = todoEntry.title

      const dueDateString = format(new Date(todoEntry.dueDate), 'E do MMM yy')
      const dueDate = document.createElement('p')
      dueDate.classList.add('todo-entry-duedate')
      dueDate.innerText = `Due: ${dueDateString}`

      const completeButton = document.createElement('span')
      completeButton.classList.add('todo-entry-complete-button')
      completeButton.classList.add('material-symbols-rounded')
      completeButton.classList.add('button-hidden')
      completeButton.innerText = 'checkmark'
      completeButton.addEventListener('click', () => {
        if (wrapper.classList.contains('todo-completed')) {
          todoEntry.completed = false
          dataHandler.storeProjects()
          return domController.renderPage()
        }
        todoEntry.completed = true
        dataHandler.storeProjects()
        domController.renderPage()
      })

      const deleteButton = document.createElement('span')
      deleteButton.classList.add('todo-entry-delete-button')
      deleteButton.classList.add('material-symbols-rounded')
      deleteButton.classList.add('button-hidden')
      deleteButton.innerText = 'delete'
      deleteButton.addEventListener('click', () => {
        dataHandler
          .currentProject()
          .todoEntries.splice(
            dataHandler.currentProject().todoEntries.indexOf(todoEntry),
            1
          )
        dataHandler.storeProjects()
        domController.renderPage()
      })

      wrapper.append(priorityMarker, title, dueDate, completeButton, deleteButton)
      elements.push(wrapper)
    }
    return elements
  }

  const noteListElements = () => {
    const elements = []

    for (const noteEntry of dataHandler.currentProject().noteEntries) {
      const wrapper = document.createElement('li')
      wrapper.classList.add('note-entry')
      wrapper.addEventListener('click', (e) => {
        const isDeleteButton = !!e.target.classList.contains(
          'note-entry-delete-button'
        )
        if (isDeleteButton) return

        const form = document.forms.namedItem('note-form')
        domController.openModal(form, true, noteEntry)
      })
      wrapper.addEventListener('mouseenter', e => {
        const deleteButton = e.target.querySelector('.note-entry-delete-button')

        deleteButton.classList.remove('button-hidden')
      })

      wrapper.addEventListener('mouseleave', e => {
        const deleteButton = e.target.querySelector('.note-entry-delete-button')

        deleteButton.classList.add('button-hidden')
      })

      const title = document.createElement('h3')
      title.classList.add('note-entry-title')
      title.innerText = noteEntry.title

      const content = document.createElement('p')
      content.classList.add('note-entry-content')
      content.innerText = noteEntry.content

      const deleteButton = document.createElement('span')
      deleteButton.classList.add('note-entry-delete-button')
      deleteButton.classList.add('material-symbols-rounded')
      deleteButton.classList.add('button-hidden')
      deleteButton.innerText = 'delete'
      deleteButton.addEventListener('click', (e) => {
        dataHandler
          .currentProject()
          .noteEntries.splice(
            dataHandler.currentProject().noteEntries.indexOf(noteEntry),
            1
          )
        dataHandler.storeProjects()
        domController.renderPage()
      })

      wrapper.append(title, content, deleteButton)
      elements.push(wrapper)
    }
    return elements
  }

  const checklistContainerElements = () => {
    const elements = []

    for (const checklistEntry of dataHandler.currentProject()
      .checklistEntries) {
      const wrapper = document.createElement('div')
      wrapper.classList.add('checklist-entry')
      wrapper.addEventListener('click', (e) => {
        const isDeleteButton =
          !!e.target.classList.contains('checklist-member-delete-button') ||
          !!e.target.classList.contains('checklist-entry-delete-button')
        const isCheckBox = e.target.type === 'checkbox'

        if (isDeleteButton || isCheckBox) return

        const form = document.forms.namedItem('checklist-form')
        domController.openModal(form, true, checklistEntry)
      })
      wrapper.addEventListener('mouseenter', e => {
        const deleteButton = e.target.querySelector('.checklist-entry-delete-button')

        deleteButton.classList.remove('button-hidden')
      })

      wrapper.addEventListener('mouseleave', e => {
        const deleteButton = e.target.querySelector('.checklist-entry-delete-button')

        deleteButton.classList.add('button-hidden')
      })

      const title = document.createElement('h3')
      title.classList.add('checklist-entry-title')
      title.innerText = checklistEntry.title

      const deleteButton = document.createElement('span')
      deleteButton.classList.add('checklist-entry-delete-button')
      deleteButton.classList.add('material-symbols-rounded')
      deleteButton.classList.add('button-hidden')
      deleteButton.innerText = 'delete'
      deleteButton.addEventListener('click', () => {
        dataHandler
          .currentProject()
          .checklistEntries.splice(
            dataHandler
              .currentProject()
              .checklistEntries.indexOf(checklistEntry),
            1
          )
        dataHandler.storeProjects()
        domController.renderPage()
      })

      const checklistMemberContainer = document.createElement('div')
      checklistMemberContainer.classList.add(
        'checklist-entry-member-container'
      )

      for (const checklistMember of checklistEntry.checklist) {
        const memberWrapper = document.createElement('div')
        memberWrapper.classList.add('checklist-member')
        memberWrapper.addEventListener('mouseenter', e => {
          const deleteButton = e.target.querySelector('.checklist-member-delete-button')

          deleteButton.classList.remove('button-hidden')
        })

        memberWrapper.addEventListener('mouseleave', e => {
          const deleteButton = e.target.querySelector('.checklist-member-delete-button')

          deleteButton.classList.add('button-hidden')
        })

        const memberCheckBox = document.createElement('input')
        memberCheckBox.type = 'checkbox'
        memberCheckBox.checked = checklistMember.completed
        memberCheckBox.addEventListener('change', (e) => {
          const currentEntry = checklistEntry.checklist.find((member) => {
            return member.content === checklistMember.content
          })
          currentEntry.completed = e.target.checked
          dataHandler.storeProjects()
          domController.renderPage()
        })

        const memberContent = document.createElement('p')
        memberContent.classList.add('checklist-member-content')
        memberContent.innerText = checklistMember.content

        const memberDeleteButton = document.createElement('span')
        memberDeleteButton.classList.add('checklist-member-delete-button')
        memberDeleteButton.classList.add('button-hidden')
        memberDeleteButton.classList.add('material-symbols-rounded')
        memberDeleteButton.innerText = 'delete'
        memberDeleteButton.addEventListener('click', () => {
          if (checklistMemberContainer.children.length === 1) return

          checklistEntry.checklist.splice(
            checklistEntry.checklist.indexOf(checklistMember),
            1
          )
          dataHandler.storeProjects()
          domController.renderPage()
        })

        memberWrapper.append(memberCheckBox, memberContent, memberDeleteButton)
        checklistMemberContainer.append(memberWrapper)
      }
      title.append(deleteButton)
      wrapper.append(title, checklistMemberContainer)
      elements.push(wrapper)
    }

    return elements
  }

  const checklistFormMembers = (checklist) => {
    const container = document.getElementById(
      'checklist-form-members-container'
    )

    for (const checklistMember of checklist) {
      const wrapper = document.createElement('div')
      wrapper.classList.add('checklist-form-member')

      const checkBox = document.createElement('input')
      checkBox.type = 'checkbox'
      checkBox.checked = checklistMember.completed

      const content = document.createElement('input')
      content.classList.add('checklist-form-member-content')
      content.type = 'text'
      content.value = checklistMember.content

      wrapper.append(checkBox, content)
      container.append(wrapper)
    }
  }

  const projectSelection = (projectTitle) => {
    const projectOption = document.createElement('option')

    projectOption.value = projectTitle
    projectOption.innerText = projectTitle

    return projectOption
  }

  return {
    todoListElements,
    noteListElements,
    checklistContainerElements,
    checklistFormMembers,
    projectSelection
  }
})()

export default elementBuilder
