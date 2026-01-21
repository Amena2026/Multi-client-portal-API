const supabase = require('../config/supabase')

// fetch all tasks with optional filtering

// GET api/tasks
// Get api/tasks?project_id=abc123
// GET api/tasks?done=true
// Get api/tasks?project_id=abc123&done=true
const getAllTasks = async (req, res) => {
    try {
       // 1. Extract query params
       const {project_id, done } = req.query;
       // inner join from the projects table and display the id, description and status from the project 
       let query = supabase
         .from('tasks')
         .select(`
            *,
            project:projects(id, description, status)
        `)

        if (project_id) {
            query = query.eq('project_id', project_id)
        }

        if (done) {
            query = query.eq('done', done)
        }

        const {data, error} = await query.order(`created_at`, {ascending: false})

        if (error) throw error
        res.json(data)
    
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: error.message });
    }
}

// GET api/task:id

const getSingleTask = async (req, res) => {
    try {
      const {id} = req.params
      const {data, error} = await supabase
        .from('tasks')
        .select(`
          *,
          project:projects(id, description, status)
        `)
        .eq('id', id)
        .single();

        if (error) throw error

        if (!data) {
            return res.status(404).json({error: 'task not found'})
        }
        res.json(data)
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({error: error.message});
    }
}
// POST api/task

const createNewTask = async (req, res) => {
    try {
        const {project_id, title,description,done, due_date} = req.body

        if(!title) {
            return res.status(400).json({error: 'title cannot be missing'})
        }

        if (project_id) {
            const {data: project, error: projectError} = await supabase
            .from('projects')
            .select('id')
            .eq('id', project_id)
            .single()

            if (projectError || !project) {
                return res.status(400).json({
                 error: 'invalid project-id'
                })
            }
        }

        // create the task
        const {data, error} = await supabase
        .from('tasks')
        .insert([{
            project_id,
            title,
            description,
            done: done ?? false,
            due_date
        }])
        .select(`
          *,
          project:projects(id, name, description, status)
        `)
        
        if (error) throw error
        res.status(201).json(data[0])
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: error.message });
    }
}
// PATCH api/task:id

const updateTask = async (req, res) => {
    try {
        const { id } = req.params
        const updates = req.body
        
        if (updates.project_id) {
            const {data: project, error: projectError } = await supabase
            .from('projects')
            .select(`id`)
            .eq('id', updates.project_id)
            .single();

            if (projectError || !project) {
                return res.status(400).json({
                    error: 'invalid project id'
                })
            }
        }

        const {data, error} = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select(`
        *,
        project:projects(id, name, description, status)
        `)

        if (error) throw error

        if (data.length === 0) {
            return res.status(404).json({error: 'task not found'})
        }
        res.json(data[0])
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: error.message });
    }
}
// DELETE api/task
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params 

        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', id)
          .select()

        if (error) throw error;
        res.status(204).send()
        
    } catch (error) {
        console.error('Error deleting task', error);
        res.status(500).json({error: error.message})
    }
}

module.exports = {
    getAllTasks,
    getSingleTask,
    createNewTask,
    updateTask,
    deleteTask
}
