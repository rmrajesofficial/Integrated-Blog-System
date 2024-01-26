import { useEffect, useState } from 'react';
import { VStack, Input, Button, Heading, Text, Link, useToast, FormControl } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const toast = useToast();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(formData);
            const response = await axios.post('http://localhost:8000/api/login/', formData);
            console.log(response.data);
            localStorage.setItem("access", response.data.access)
            localStorage.setItem("refresh", response.data.refresh)
            localStorage.setItem("id", response.data.id)
            navigate(`/dashboard/${response.data.id}`);
        } catch (error) {
            console.log(error);
            toast({
                title: '',
                description: 'Login Failed',
                status: 'error',
                variant: 'left-accent',
                duration: 4000,
                isClosable: true,
                position: 'bottom'
            })
        }
    };

    useEffect(() => {
        const userToken = localStorage.getItem('access');
        const id = localStorage.getItem('id');
        if (userToken || id) {
            navigate(`/dashboard/${id}`);
        }
    }, []);

    return (
        <VStack
            as="form"
            onSubmit={handleSubmit}
            spacing={4}
            align="stretch"
            maxW="400px"
            mx="auto"
            p={8}
            borderWidth={1}
            borderRadius="lg"
            boxShadow="lg"
        >
            <Heading as="h3" size="lg" mb={4} textAlign={'center'}>
                Login
            </Heading>
            <FormControl>
                <Input
                    type="username"
                    placeholder="Enter username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
            </FormControl>
            <FormControl>
                <Input
                    type="password"
                    placeholder="Enter password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
            </FormControl>
            <Button type="submit" colorScheme="teal" variant="solid">
                Login
            </Button>
            <Text fontSize="sm" textAlign="right" mt={2}>
                Not registered yet? <Link href="/signup">Sign up</Link>
            </Text>
        </VStack>


    );
};

export default Login;
