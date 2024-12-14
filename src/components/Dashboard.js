import React, { useState, useEffect } from "react";
import {
    getClients,
    getVoitures,
    addClient,
    addVoiture,
    getVoituresByClientId,
    deleteClient,
    deleteVoiture,
    updateClient,
    updateVoiture
} from "../services/apiService";
import { Modal, Button, Form, Table, Card, Row, Col, Container } from "react-bootstrap";

function Dashboard() {
    const [clients, setClients] = useState([]);
    const [voitures, setVoitures] = useState([]);
    const [filteredVoitures, setFilteredVoitures] = useState([]);
    const [searchClientName, setSearchClientName] = useState("");

    const [selectedClientId, setSelectedClientId] = useState(null);
    const [selectedVoitureId, setSelectedVoitureId] = useState(null);

    const [showClientModal, setShowClientModal] = useState(false);
    const [showVoitureModal, setShowVoitureModal] = useState(false);

    const [newClient, setNewClient] = useState({ nom: "", age: "" });
    const [newVoiture, setNewVoiture] = useState({
        marque: "",
        matricule: "",
        model: "",
    });

    const [isEditingClient, setIsEditingClient] = useState(false);
    const [isEditingVoiture, setIsEditingVoiture] = useState(false);

    useEffect(() => {
        fetchClients();
        fetchVoitures();
    }, []);

    const fetchClients = async () => {
        const response = await getClients();
        setClients(response.data);
    };

    const fetchVoitures = async () => {
        const response = await getVoitures();
        setVoitures(response.data);
    };

    const handleAddOrUpdateClient = async () => {
        if (isEditingClient) {
            await updateClient(selectedClientId, newClient);
        } else {
            await addClient(newClient);
        }
        setNewClient({ nom: "", age: "" });
        fetchClients();
        setShowClientModal(false);
        setIsEditingClient(false);
    };

    const handleAddOrUpdateVoiture = async () => {
        if (isEditingVoiture) {
            await updateVoiture(selectedVoitureId, newVoiture);
        } else {
            await addVoiture(selectedClientId, newVoiture);
        }
        setNewVoiture({ marque: "", matricule: "", model: "" });
        fetchVoitures();
        setShowVoitureModal(false);
        setIsEditingVoiture(false);
    };

    const handleSearchVoituresByClientName = () => {
        const client = clients.find((c) =>
            c.nom.toLowerCase().includes(searchClientName.toLowerCase())
        );
        if (client) {
            setSelectedClientId(client.id);
            handleSearchVoituresByClient(client.id);
        } else {
            setFilteredVoitures([]);
        }
    };

    const handleSearchVoituresByClient = async (clientId) => {
        const response = await getVoituresByClientId(clientId);
        setFilteredVoitures(response.data);
    };

    const handleDeleteClient = async (id) => {
        await deleteClient(id);
        fetchClients();
    };

    const handleDeleteVoiture = async (id) => {
        await deleteVoiture(id);
        fetchVoitures();
    };

    const openEditClientModal = (client) => {
        setNewClient({ nom: client.nom, age: client.age });
        setSelectedClientId(client.id);
        setIsEditingClient(true);
        setShowClientModal(true);
    };

    const openEditVoitureModal = (voiture) => {
        setNewVoiture({
            marque: voiture.marque,
            matricule: voiture.matricule,
            model: voiture.model,
        });
        setSelectedVoitureId(voiture.id);
        setIsEditingVoiture(true);
        setShowVoitureModal(true);
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center text-primary mb-4">Dashboard</h1>

            {/* Row for Clients and Voitures */}
            <Row className="mb-4">
                {/* Clients Section */}
                <Col md={6}>
                    <Card>
                        <Card.Header className="bg-primary text-white">
                            <h4>Clients</h4>
                        </Card.Header>
                        <Card.Body>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Age</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clients.map((client) => (
                                        <tr key={client.id}>
                                            <td>{client.nom}</td>
                                            <td>{client.age}</td>
                                            <td>
                                                <Button
                                                    variant="warning"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => openEditClientModal(client)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleDeleteClient(client.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    setShowClientModal(true);
                                    setIsEditingClient(false);
                                    setNewClient({ nom: "", age: "" });
                                }}
                            >
                                Add Client
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Voitures Section */}
                <Col md={6}>
                    <Card>
                        <Card.Header className="bg-success text-white">
                            <h4>Voitures</h4>
                        </Card.Header>
                        <Card.Body>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Marque</th>
                                        <th>Matricule</th>
                                        <th>Model</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {voitures.map((voiture) => (
                                        <tr key={voiture.id}>
                                            <td>{voiture.marque}</td>
                                            <td>{voiture.matricule}</td>
                                            <td>{voiture.model}</td>
                                            <td>
                                                <Button
                                                    variant="warning"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => openEditVoitureModal(voiture)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleDeleteVoiture(voiture.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <Button
                                variant="success"
                                onClick={() => {
                                    setShowVoitureModal(true);
                                    setIsEditingVoiture(false);
                                    setNewVoiture({ marque: "", matricule: "", model: "" });
                                }}
                            >
                                Add Voiture
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Search Section */}
            <Card>
                <Card.Header className="bg-info text-white">
                    <h4>Search Voitures by Client Name</h4>
                </Card.Header>
                <Card.Body>
                    <Form.Control
                        type="text"
                        placeholder="Enter client name"
                        value={searchClientName}
                        onChange={(e) => setSearchClientName(e.target.value)}
                        className="mb-3"
                    />
                    <Button
                        variant="info"
                        onClick={handleSearchVoituresByClientName}
                        className="mb-3"
                    >
                        Search
                    </Button>
                    <ul>
                        {filteredVoitures.map((voiture) => (
                            <li key={voiture.id}>
                                {voiture.marque} - {voiture.model} ({voiture.matricule})
                            </li>
                        ))}
                    </ul>
                </Card.Body>
            </Card>

            {/* Client Modal */}
            <Modal show={showClientModal} onHide={() => setShowClientModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditingClient ? "Edit Client" : "Add Client"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter name"
                                value={newClient.nom}
                                onChange={(e) =>
                                    setNewClient({ ...newClient, nom: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mt-2">
                            <Form.Label>Age</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter age"
                                value={newClient.age}
                                onChange={(e) =>
                                    setNewClient({ ...newClient, age: e.target.value })
                                }
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowClientModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddOrUpdateClient}>
                        {isEditingClient ? "Save Changes" : "Add Client"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Voiture Modal */}
            <Modal show={showVoitureModal} onHide={() => setShowVoitureModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditingVoiture ? "Edit Voiture" : "Add Voiture"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Marque</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter marque"
                                value={newVoiture.marque}
                                onChange={(e) =>
                                    setNewVoiture({ ...newVoiture, marque: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mt-2">
                            <Form.Label>Matricule</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter matricule"
                                value={newVoiture.matricule}
                                onChange={(e) =>
                                    setNewVoiture({ ...newVoiture, matricule: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mt-2">
                            <Form.Label>Model</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter model"
                                value={newVoiture.model}
                                onChange={(e) =>
                                    setNewVoiture({ ...newVoiture, model: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Select Client</Form.Label>
                            <Form.Select
                                onChange={(e) => setSelectedClientId(e.target.value)}
                                value={selectedClientId}
                            >
                                <option value="">Select Client</option>
                                {clients.map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.nom}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowVoitureModal(false)}>
                        Close
                    </Button>
                    <Button variant="success" onClick={handleAddOrUpdateVoiture}>
                        {isEditingVoiture ? "Save Changes" : "Add Voiture"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Dashboard;
