function entry({ title, entryType }) {
    return { title, entryType };
}

function todoEntry(data) {
    const proto = entry({ title: data.title, entryType: 'todo' });

    if (data.dueDate == 'Invalid Date') data.dueDate = new Date();

    return {
        creationDate: data.creationDate,
        dueDate: data.dueDate,
        description: data.description,
        priority: data.priority,
        completed: data.completed,
        ...proto,
    };
}

function noteEntry(data) {
    const proto = entry({ title: data.title, entryType: 'note' });
    return { ...proto, content: data.content };
}

function checklistEntry(data) {
    const proto = entry({ title: data.title, entryType: 'checklist' });
    return { ...proto, checklist: data.checklist };
}

export { todoEntry, noteEntry, checklistEntry };
