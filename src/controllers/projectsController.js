const supabase = require('../config/supabase');

// GET /api/projects
// optional query params: ?client_id=uuid & status =
const getAllProjects = async (req, res) => {
  try {
    const {client_id, status } = req.query;
    
    let query = supabase
      .from('projects')
      // inner join between the projects and client table to get projects that belong to individual clients 
      // the id, name, email & phone parameters are the columns from the client table to include
      .select(`
        *,
        client:clients(id, name, email, phone)
      `);

      // filter by client_id if provided
      if (client_id) {
        query = query.eq('client_id', client_id)
      }

      if (status) {
        query = query.eq('status', status)
      }

      const {data, error } = await query.order('created_at', {ascending: false});

      if (error) throw error;
    
      res.json(data)
  } catch (error) {
    console.error('Error fetching projects: ', error)
    res.status(500).json({ error: error.message });
  }
};

// Get a single project by ID
const getProjectById = async (req, res) => {
  try {
    const {id} = req.params
    const {data, error} = await supabase
      .from('projects')
      .select(`
        *,
        client:clients(id, name, email, phone)
      `)
      .eq('id', id)
      .single();

      if (error) throw errow;

      if (!data) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json(data);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({error: error.message});
  }
}

// POST /api/projects
const createNewProject = async (req, res) => {
  try {
    const { client_id, name, description, status } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }
    
    // If client_id is provided, verify that client exists
    if (client_id) {
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('id', client_id)
        .single();
      
      if (clientError || !client) {
        return res.status(400).json({ 
          error: 'Invalid client_id - client does not exist' 
        });
      }
    }
    
    // Create the project
    const { data, error } = await supabase
      .from('projects')
      .insert([{ 
        client_id, 
        name, 
        description, 
        status: status || 'active' 
      }])
      .select(`
        *,
        client:clients(id, name, email, phone)
      `);
    
    if (error) throw error;
    
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: error.message });
  }
};

// PATCH /api/projects/:id
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // If updating client_id, verify the new client exists
    if (updates.client_id) {
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('id', updates.client_id)
        .single();
      
      if (clientError || !client) {
        return res.status(400).json({ 
          error: 'Invalid client_id - client does not exist' 
        });
      }
    }
    
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        client:clients(id, name, email, phone)
      `);
    
    if (error) throw error;
    
    if (data.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(data[0]);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {

    const { id } = req.params

    const { error } = await supabase
      .from ('projects')
      .delete()
      .eq('id', id)
      .select()
      
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting project', error);
    res.status(500).json({error: error.message})
  }
}

module.exports = {
  getAllProjects,
  getProjectById,
  createNewProject,
  updateProject,
  deleteProject
}