import React, { useState, useEffect } from 'react';
import {
    Button, VStack, Text, useToast, Image, Flex, Heading, Switch, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, Textarea, Select, ModalFooter, Center,
} from '@chakra-ui/react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const calculateEndTime = (app) => {
    const start = new Date(`${app.date}T${app.time}`);
    const end = new Date(start.getTime() + 45 * 60000);
    return end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
const Profile = () => {
    const access = localStorage.getItem('access');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isopenAppointment, onOpen: onopenAppointment, onClose: closeAppointment } = useDisclosure();
    const { isOpen: isPopup, onOpen: onPopup, onClose: ClosePopup } = useDisclosure();
    const toast = useToast();
    const [detail, setDetail] = useState({
        id: '',
        first_name: '',
        last_name: '',
        user_type: '',
        address: '',
        profile_picture: '',
        email: '',
        username: '',
        password: '',
        repassword: '',
    });
    const [currentAppointments, setCurrentAppointments] = useState([])
    const [myAppointments, setMyAppointments] = useState([])
    const [doctors, setDoctors] = useState([]);
    const [appointment, setAppointment] = useState({
        id: '',
        doctors_name: '',
        speciality: '',
        date: '',
        time: '',
    });
    const [blogs, setBlogs] = useState([{
        title: '',
        image: 'hekko',
        category: 'hekko',
        summary: 'hekko',
        content: 'Mental Health',
        doctor: { first_name: '' },
        upload: false,
    }]);
    const [formData, setFormData] = useState({
        title: '', //input field
        image: null,  //image field
        category: '', //options are Mental Health, Heart Disease, Covid19, Immunization
        summary: '', //input field
        content: '', //textarea
        upload: false, //switch 
    });


    const navigate = useNavigate();


    const handleInputChange = (e) => {
        e.preventDefault()
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const handleFileInputChange = (e) => {
        const { name } = e.target;
        const file = e.target.files[0];
        setFormData({
            ...formData,
            [name]: file,
        });
    };

    const handleSwitchChange = () => {
        setFormData((prevData) => ({ ...prevData, upload: !prevData.upload }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (detail.user_type === 'Patient') {
            toast({
                title: '',
                description: "Only Faculty can create Blogs",
                status: 'error',
                variant: 'left-accent',
                duration: 4000,
                isClosable: true,
                position: 'bottom'
            })
            return
        }
        try {
            console.log(formData);
            const response = await axios.post(`http://localhost:8000/api/createblog/?id=${localStorage.getItem('id')}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `JWT ${access}`,
                },
            });
            onClose();
            toast({
                title: '',
                description: response.data.message,
                status: 'success',
                variant: 'left-accent',
                duration: 4000,
                isClosable: true,
                position: 'bottom'
            })
        } catch (error) {
            console.log(error);
            toast({
                title: '',
                description: 'Failed to create new Blog',
                status: 'error',
                variant: 'left-accent',
                duration: 4000,
                isClosable: true,
                position: 'bottom'
            })
        }
    };
    const changeState = async (id, state) => {
        console.log(id, state);
        try {
            console.log(formData);
            const response = await axios.post(`http://localhost:8000/api/blogchange/?id=${id}&state=${state}`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `JWT ${access}`,
                },
            });
            await fetchBlogs(detail.user_type);
            toast({
                title: '',
                description: response.data.message,
                status: 'success',
                variant: 'left-accent',
                duration: 4000,
                isClosable: true,
                position: 'bottom'
            })
        } catch (error) {
            console.log(error);
            toast({
                title: '',
                description: 'Failed to change the state ',
                status: 'error',
                variant: 'left-accent',
                duration: 4000,
                isClosable: true,
                position: 'bottom'
            })
        }
    };



    const handleLogout = async () => {
        try {
            toast({
                title: '',
                description: 'Logout Successfull',
                status: 'success',
                variant: 'left-accent',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            })
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            localStorage.removeItem("id");
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/user/?id=${localStorage.getItem('id')}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `JWT ${access}`,
                },
            });
            setDetail(response.data)
            console.log(response.data);
            await fetchBlogs(response.data.user_type);
            await fetchDoctor(response.data.user_type)
            await fetchAppointments(response.data.user_type)
        } catch (error) {
            handleLogout()
            console.error(error);
        }
    };
    const fetchBlogs = async (type) => {
        try {
            let response
            if (type === 'Patient') {
                response = await axios.get(`http://localhost:8000/api/blog/`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            } else {
                response = await axios.get(`http://localhost:8000/api/blog/?id=${localStorage.getItem('id')}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            }
            setBlogs(response.data)
            console.log(response.data);
        } catch (error) {
            // handleLogout()
            console.error(error);
        }
    };
    const fetchDoctor = async (type) => {
        try {
            let response
            if (type === 'Doctor') {
                return
            } else {
                response = await axios.get(`http://localhost:8000/api/getuser/?q=Doctors`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            }
            setDoctors(response.data)
            console.log("doctors", response.data);
        } catch (error) {
            handleLogout()
            console.error(error);
        }
    }
    const fetchAppointments = async (type) => {
        try {
            let response
            response = await axios.get(`http://localhost:8000/api/getappointments/`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `JWT ${access}`,
                },
            });
            setCurrentAppointments(response.data.upcomming)
            setMyAppointments(response.data.current)
            console.log("currentAppointments", response.data);
        } catch (error) {
            // handleLogout()
            console.error(error);
        }
    }
    const handleAppointment = (id, name) => {
        setAppointment({
            id: id,
            doctors_name: name,
            speciality: '',
            date: '',
            time: '',
        });
        onopenAppointment()
    }
    const handleAppointmentChange = (e) => {
        const { name, value } = e.target;
        setAppointment((prevAppointment) => ({
            ...prevAppointment,
            [name]: value,
        }));
    };
    const handleAppointSubmit = async () => {
        try {
            const response = await axios.post(`http://localhost:8000/api/createappointment/`, appointment, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `JWT ${access}`,
                },
            });
            toast({
                title: '',
                description: response.data.message,
                status: 'success',
                variant: 'left-accent',
                duration: 4000,
                isClosable: true,
                position: 'bottom'
            })
            closeAppointment();
        } catch (error) {
            console.log(error);
            toast({
                title: '',
                description: 'Failed to book appointment',
                status: 'error',
                variant: 'left-accent',
                duration: 4000,
                isClosable: true,
                position: 'bottom'
            })
        }
    };
    const handleAppoints = async (id, action) => {
        try {
            const response = await axios.post(`http://localhost:8000/api/handle/?id=${id}&action=${action}`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `JWT ${access}`,
                },
            });
            toast({
                title: '',
                description: response.data.message,
                status: 'success',
                variant: 'left-accent',
                duration: 4000,
                isClosable: true,
                position: 'bottom'
            })
            fetchData();
        } catch (error) {
            console.log(error);
            toast({
                title: '',
                description: 'Failed to book appointment',
                status: 'error',
                variant: 'left-accent',
                duration: 4000,
                isClosable: true,
                position: 'bottom'
            })
        }
    }

    useEffect(() => {
        if (access) {
            fetchData();

        }
        else handleLogout()
    }, []);

    return (
        <>{currentAppointments.length > 0 && (currentAppointments.map((myap) => (
            <VStack spacing={4}
                align="stretch"
                maxW="1000px"
                p={4}
                mx="auto"
                my={2}
                borderWidth={1}
                borderRadius="lg"
                boxShadow="lg">
                <Text my={'auto'}>
                    You have a New appointment request from <strong>{myap.patient.first_name}</strong> at <strong>{myap.time}</strong> - <strong>{myap.date}</strong>
                    <Button colorScheme='red' ml='235px' mr='5' onClick={() => handleAppoints(myap.id, "no")}>Reject</Button>
                    <Button colorScheme='green' onClick={() => handleAppoints(myap.id, "yes")}>Accept</Button></Text>
            </VStack >)))}

            <VStack as="form"
                spacing={4}
                align="stretch"
                maxW="400px"
                mx="auto"
                p={8}
                borderWidth={1}
                borderRadius="lg"
                boxShadow="lg">
                <Text fontSize="3xl" fontWeight="bold" textAlign={'center'}>
                    Profile Details
                </Text>
                {detail.profile_picture ? (
                    <Image
                        src={"http://localhost:8000" + detail.profile_picture}
                        alt="Profile Photo"
                        boxSize="150px"
                        objectFit="cover"
                        borderRadius="full"
                        my={4}
                        mx={'auto'}
                    />
                ) : (
                    <Text>No profile picture available</Text>
                )}
                <Text fontSize="lg" ml={'xl'}>
                    <strong>ID:</strong> {detail.id}
                </Text>
                <Text fontSize="lg" ml={'xl'}>
                    <strong>First Name:</strong> {detail.first_name}
                </Text>
                <Text fontSize="lg" ml={'xl'}>
                    <strong>Last Name:</strong> {detail.last_name}
                </Text>
                <Text fontSize="lg" ml={'xl'}>
                    <strong>Email:</strong> {detail.email}
                </Text>
                <Text fontSize="lg" ml={'xl'}>
                    <strong>Address:</strong> {detail.address}
                </Text>
                <Text fontSize="lg" ml={'xl'}>
                    <strong>Type:</strong> {detail.user_type}
                </Text>
                <Text fontSize="lg" ml={'xl'}>
                    <strong>Username:</strong> {detail.username}
                </Text>
                {/* Add more details as needed */}
                <Button colorScheme="teal" variant="solid" onClick={handleLogout}>
                    Logout
                </Button>
            </VStack>
            {
                detail.user_type === 'Doctor' ? (<div style={{ display: "flex", justifyContent: "center" }}>
                    <Button colorScheme="teal" mt={'50px'} variant="solid" onClick={onOpen}>
                        Add Blog +
                    </Button>
                </div >) : (<></>)
            }
            {myAppointments.length > 0 && (
                <VStack as="form" spacing={4} alignItems={'start'} maxW="full" m="20px" p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
                    <Heading size='md'>Appointment Detail:</Heading>
                    <Flex overflowX={'auto'}>
                        {myAppointments.map((app) => (
                            <VStack
                                as="form"
                                spacing={4}
                                align="stretch"
                                maxW="400px"
                                m="20px"
                                borderLeft={"50px solid teal"}
                                borderWidth={1}
                                borderRadius="lg"
                                boxShadow="lg"
                                key={app.id}
                                p={4}
                                bg="white"
                                color="gray.800"
                            >
                                {(detail.user_type === "Patient") ? (
                                    <Text fontSize="lg" fontWeight="bold">
                                        Doctor: {app.doctor.first_name}
                                    </Text>
                                ) : (
                                    <Text fontSize="lg" fontWeight="bold">
                                        Patient: {app.patient.first_name}
                                    </Text>
                                )}
                                <Text fontSize="sm" >
                                    <strong>Date:</strong> {app.date}
                                </Text>
                                <Text fontSize="sm" >
                                    <strong>Start Time:</strong> {app.time}
                                </Text>
                                <Text fontSize="sm" >
                                    <strong>End Time:</strong> {calculateEndTime(app)}
                                </Text>
                            </VStack>
                        ))}

                    </Flex>
                </VStack>)}
            {
                doctors.length > 0 && detail.user_type == "Patient" && (
                    <VStack as="form" spacing={4} alignItems={'start'} maxW="full" m="20px" p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
                        <Heading size='md'>Available Doctors:</Heading>
                        <Flex overflowX={'auto'}>
                            {doctors.map((doctor) => (
                                <VStack as="form" spacing={4} align="stretch" maxW="400px" m="20px" borderWidth={1} borderRadius="lg" boxShadow="lg" key={doctor.id}>
                                    {doctor.profile_picture ? (
                                        <Image src={"http://localhost:8000" + doctor.profile_picture} alt="Doctor Image" boxSize="200px" height='200px' width="200px" objectFit="cover" mx={'auto'} />
                                    ) : (
                                        <Text>No image available</Text>
                                    )}
                                    <Text fontSize="lg" ml={'xl'} mx='15px' textAlign={'center'}>
                                        <strong>{doctor.first_name}</strong>
                                    </Text>
                                    <Button colorScheme="teal" variant="solid" m="10px" onClick={() => handleAppointment(doctor.id, doctor.first_name)}>
                                        Book Appointment
                                    </Button>
                                </VStack>
                            ))}
                        </Flex>
                    </VStack>)
            }


            {
                blogs && blogs.length > 0 && (
                    <VStack as="form"
                        // spacing={4}
                        alignItems={'start'}
                        maxW="full"
                        m="20px"
                        p={8}
                        borderWidth={1}
                        borderRadius="lg"
                        boxShadow="lg">
                        <Heading size='md'>
                            Blogs related Mental Health:
                        </Heading>
                        <Flex overflowX={'auto'}>
                            {
                                blogs && blogs.map((blog) => ((blog.category === 'Mental Health') ? (
                                    <VStack
                                        as="form"
                                        spacing={4}
                                        align="stretch"
                                        maxW="400px"
                                        m="20px"
                                        borderWidth={1}
                                        borderRadius="lg"
                                        boxShadow="lg"
                                        key={blog.id} // Add a unique key for each mapped item
                                    >
                                        {blog.image ? (
                                            <Image
                                                src={"http://localhost:8000" + blog.image}
                                                alt="Blog Image"
                                                boxSize="200px"
                                                width={'full'}
                                                objectFit="cover"
                                                mx={'auto'}
                                            />
                                        ) : (
                                            <Text>No image available</Text>
                                        )}
                                        <Text fontSize="lg" ml={'xl'} mx='15px'>
                                            <strong>{blog.title}</strong>
                                        </Text>
                                        {detail.user_type === 'Doctor' && (
                                            <Text fontSize="lg" ml={'xl'} mx='15px' textColor={(blog.upload) ? 'green' : 'red'}>
                                                <strong>{(blog.upload) ? '*Live' : 'Drafted'}</strong> <Switch size='sm' isChecked={blog.upload} onChange={() => changeState(blog.id, blog.upload)} />
                                            </Text>)}
                                        <Text fontSize="lg" ml={'xl'} mx='15px'>
                                            <strong>Category:</strong> {blog.category}
                                        </Text>
                                        <Text fontSize="lg" ml={'xl'} mx='15px'>
                                            <strong>Summary:</strong> {blog.summary}
                                        </Text>
                                        <Text fontSize="lg" ml={'xl'} mx='15px'>
                                            <strong>Created By:</strong> {blog.doctor.first_name}
                                        </Text>
                                        <Text fontSize="lg" ml={'xl'} mx='15px' mb='15px'>
                                            {blog.content}
                                        </Text>
                                    </VStack>
                                ) : (<></>)))
                            }

                        </Flex >
                        <Heading size='md'>
                            Blogs related Heart Disease:
                        </Heading>
                        <Flex overflowX={'auto'}>
                            {blogs &&
                                blogs.map((blog) => ((blog.category === 'Heart Disease') ? (
                                    <VStack
                                        as="form"
                                        spacing={4}
                                        align="stretch"
                                        maxW="400px"
                                        m="20px"
                                        borderWidth={1}
                                        borderRadius="lg"
                                        boxShadow="lg"
                                        key={blog.id} // Add a unique key for each mapped item
                                    >
                                        {blog.image ? (
                                            <Image
                                                src={"http://localhost:8000" + blog.image}
                                                alt="Blog Image"
                                                boxSize="200px"
                                                width={'full'}
                                                objectFit="cover"
                                                mx={'auto'}
                                            />
                                        ) : (
                                            <Text>No image available</Text>
                                        )}
                                        <Text fontSize="lg" ml={'xl'} mx='15px'>
                                            <strong>{blog.title}</strong>
                                        </Text>
                                        {detail.user_type === 'Doctor' && (
                                            <Text fontSize="lg" ml={'xl'} mx='15px' textColor={(blog.upload) ? 'green' : 'red'}>
                                                <strong>{(blog.upload) ? '*Live' : 'Drafted'}</strong> <Switch size='sm' isChecked={blog.upload} onChange={() => changeState(blog.id, blog.upload)} />
                                            </Text>)}
                                        <Text fontSize="lg" ml={'xl'} mx='15px'>
                                            <strong>Category:</strong> {blog.category}
                                        </Text>
                                        <Text fontSize="lg" ml={'xl'} mx='15px'>
                                            <strong>Summary:</strong> {blog.summary}
                                        </Text>
                                        <Text fontSize="lg" ml={'xl'} mx='15px'>
                                            <strong>Created By:</strong> {blog.doctor.first_name}
                                        </Text>

                                        <Text fontSize="lg" ml={'xl'} mx='15px' mb='15px'>
                                            {blog.content}
                                        </Text>
                                    </VStack>
                                ) : (<></>)))
                            }

                        </Flex >
                        <Heading size='md'>
                            Blogs related Covid19:
                        </Heading>
                        <Flex overflowX={'auto'}>
                            {
                                blogs && blogs.map((blog) => ((blog.category === 'Covid19') ? (
                                    <VStack
                                        as="form"
                                        spacing={4}
                                        align="stretch"
                                        maxW="400px"
                                        m="20px"
                                        borderWidth={1}
                                        borderRadius="lg"
                                        boxShadow="lg"
                                        key={blog.id} // Add a unique key for each mapped item
                                    >
                                        {blog.image ? (
                                            <Image
                                                src={"http://localhost:8000" + blog.image}
                                                alt="Blog Image"
                                                boxSize="200px"
                                                width={'full'}
                                                objectFit="cover"
                                                mx={'auto'}
                                            />
                                        ) : (
                                            <Text>No image available</Text>
                                        )}
                                        <Text fontSize="lg" ml={'xl'} mx='15px'>
                                            <strong>{blog.title}</strong>
                                        </Text>
                                        {detail.user_type === 'Doctor' && (
                                            <Text fontSize="lg" ml={'xl'} mx='15px' textColor={(blog.upload) ? 'green' : 'red'}>
                                                <strong>{(blog.upload) ? '*Live' : 'Drafted'}</strong> <Switch size='sm' isChecked={blog.upload} onChange={() => changeState(blog.id, blog.upload)} />
                                            </Text>)}
                                        <Text fontSize="lg" ml={'xl'} mx='15px'>
                                            <strong>Category:</strong> {blog.category}
                                        </Text>
                                        <Text fontSize="lg" ml={'xl'} mx='15px'>
                                            <strong>Summary:</strong> {blog.summary}
                                        </Text>
                                        <Text fontSize="lg" ml={'xl'} mx='15px'>
                                            <strong>Created By:</strong> {blog.doctor.first_name}
                                        </Text>
                                        <Text fontSize="lg" ml={'xl'} mx='15px' mb='15px'>
                                            {blog.content}
                                        </Text>
                                    </VStack>
                                ) : (<></>)))
                            }

                        </Flex >
                        <Heading size='md'>
                            Blogs related Immunization:
                        </Heading>
                        <Flex overflowX={'auto'}>
                            {
                                blogs && blogs.map((blog) => ((blog.category === 'Immunization') ? (
                                    <VStack
                                        as="form"
                                        spacing={4}
                                        align="stretch"
                                        maxW="400px"
                                        m="20px"
                                        borderWidth={1}
                                        borderRadius="lg"
                                        boxShadow="lg"
                                        key={blog.id} // Add a unique key for each mapped item
                                    >
                                        {blog.image ? (
                                            <Image
                                                src={"http://localhost:8000" + blog.image}
                                                alt="Blog Image"
                                                boxSize="200px"
                                                width={'full'}
                                                objectFit="cover"
                                                mx={'auto'}
                                            />
                                        ) : (
                                            <Text>No image available</Text>
                                        )}
                                        <Text fontSize="lg" ml={'xl'} mx='15px'>
                                            <strong>{blog.title}</strong>
                                        </Text>
                                        {detail.user_type === 'Doctor' && (
                                            <Text fontSize="lg" ml={'xl'} mx='15px' textColor={(blog.upload) ? 'green' : 'red'}>
                                                <strong>{(blog.upload) ? '*Live' : 'Drafted'}</strong> <Switch size='sm' isChecked={blog.upload} onChange={() => changeState(blog.id, blog.upload)} />
                                            </Text>)}
                                        <Text fontSize="lg" ml={'xl'} mx='15px'>
                                            <strong>Category:</strong> {blog.category}
                                        </Text>
                                        <Text fontSize="lg" ml={'xl'} mx='15px'>
                                            <strong>Summary:</strong> {blog.summary}
                                        </Text>
                                        <Text fontSize="lg" ml={'xl'} mx='15px'>
                                            <strong>Created By:</strong> {blog.doctor.first_name}
                                        </Text>
                                        <Text fontSize="lg" ml={'xl'} mx='15px' mb='15px'>
                                            {blog.content}
                                        </Text>
                                    </VStack>
                                ) : (<></>)))
                            }
                        </Flex >
                    </VStack >)
            }
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Blog</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl mb={4}>
                            <FormLabel>Title</FormLabel>
                            <Input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel>Image URL</FormLabel>
                            <Input
                                type="file"
                                name="image"
                                onChange={handleFileInputChange}
                            />
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel>Category</FormLabel>
                            <Select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                            >
                                <option value="Mental Health">Mental Health</option>
                                <option value="Heart Disease">Heart Disease</option>
                                <option value="Covid19">Covid19</option>
                                <option value="Immunization">Immunization</option>
                            </Select>
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel>Summary</FormLabel>
                            <Input
                                type="text"
                                name="summary"
                                value={formData.summary}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel>Content</FormLabel>
                            <Textarea
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl mb={4} display="flex" alignItems="center">
                            <FormLabel>Drafted - Live</FormLabel>
                            <Switch
                                name="upload"
                                isChecked={formData.upload}
                                onChange={handleSwitchChange}
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="teal" onClick={handleSubmit}>
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>


            <Modal isOpen={isopenAppointment} onClose={closeAppointment}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Book Appointment to {appointment.doctors_name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl mb={4}>
                            <FormLabel>Speciality</FormLabel>
                            <Input
                                type="text"
                                name="speciality"
                                value={appointment.speciality}
                                onChange={handleAppointmentChange}
                            />
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel>Date</FormLabel>
                            <Input
                                type="date"
                                name="date"
                                value={appointment.date}
                                onChange={handleAppointmentChange}
                            />
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel>Time</FormLabel>
                            <Input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleAppointmentChange}
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="teal" onClick={handleAppointSubmit}>
                            Book
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default Profile;
