import { useState } from 'react';
import { VStack, Input, Button, Heading, Text, Link, useToast, FormControl, Select, MenuItem, FormLabel } from '@chakra-ui/react';
import axios from 'axios';

const Signup = () => {
    const toast = useToast();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        repassword: '',
        profile_photo: '',
        type: '',
        address: ''
    });

    const handleChange = (e) => {
        if (e.target.type === 'file') {
            setFormData({
                ...formData,
                [e.target.name]: e.target.files[0],
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.repassword || !formData.password > 0) {
            toast({
                title: '',
                description: "Password not matched ! ",
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
            const response = await axios.post('http://localhost:8000/api/signup/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
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
        } catch (error) {
            console.log(error);
            toast({
                title: '',
                description: 'Signup is not completed',
                status: 'error',
                variant: 'left-accent',
                duration: 4000,
                isClosable: true,
                position: 'bottom'
            })
        }
    };

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
                Sign Up
            </Heading>
            <FormControl>
                <Input
                    type="text"
                    placeholder="First name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                />
            </FormControl>
            <FormControl>
                <Input
                    type="text"
                    placeholder="Last name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                />
            </FormControl>
            <FormControl>
                <Input
                    type="text"
                    placeholder="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                />
            </FormControl>
            <FormControl>
                <Select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                >
                    <option value="Patient">Patient</option>
                    <option value="Doctor">Doctor</option>
                </Select>
            </FormControl>
            <FormControl mt={4}>
                <Input
                    type="file"
                    id="profile_photo"
                    name="profile_photo"
                    onChange={handleChange}
                />
            </FormControl>
            <FormControl>
                <Input
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
            </FormControl>
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
            <FormControl>
                <Input
                    type="password"
                    placeholder="Re-enter password"
                    name="repassword"
                    value={formData.repassword}
                    onChange={handleChange}
                />
            </FormControl>
            <Button type="submit" colorScheme="teal" variant="solid">
                Sign Up
            </Button>
            <Text fontSize="sm" textAlign="right" mt={2}>
                Already registered? <Link href="/">Sign in</Link>
            </Text>
        </VStack>

    );
};

export default Signup;
