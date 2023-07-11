import {
	GoogleAuthProvider,
	createUserWithEmailAndPassword,
	getAuth,
	signInWithEmailAndPassword,
	signInWithPopup,
} from "firebase/auth";
import { useContext, useState } from "react";
import { Button, Col, Form, Image, Modal, Row, Alert } from "react-bootstrap";
import { AuthContext } from "../components/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
	const loginImage = "https://sig1.co/img-twitter-1";
	const [modalShow, setModalShow] = useState(null);
	const handleShowSignUp = () => setModalShow("signup");
	const handleShowLogin = () => setModalShow("login");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const auth = getAuth();
	const navigate = useNavigate();
	const { currentUser } = useContext(AuthContext);
	const provider = new GoogleAuthProvider();
	const [errorMessage, setErrorMessage] = useState("");

	if (currentUser) navigate("/profile");

	const handleSignUp = async (e) => {
		e.preventDefault();
		try {
			const res = await createUserWithEmailAndPassword(
				auth,
				username,
				password
			);
			console.log(res.user);
		} catch (error) {
			console.error(error);
			setErrorMessage("Failed to create an account. Please try again.");
		}
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			await signInWithEmailAndPassword(auth, username, password);
		} catch (error) {
			console.error(error);
			setErrorMessage("Invalid username or password!");
		}
	};

	const handleGoogleLogin = async (e) => {
		e.preventDefault();
		try {
			await signInWithPopup(auth, provider);
		} catch (error) {
			console.error(error);
			setErrorMessage("Failed to sign in with Google. Please try again.");
		}
	};

	const handleClose = () => {
		setModalShow(null);
		setErrorMessage(""); // Reset the error message when closing the modal
	};

	return (
		<Row>
			<Col sm={6}>
				<Image src={loginImage} fluid />
			</Col>
			<Col sm={6} className="p-4">
				<i
					className="bi bi-twitter"
					style={{ fontSize: 50, color: "dodgerblue" }}
				></i>

				<p className="mt-5" style={{ fontSize: 64 }}>
					Happening Now
				</p>
				<h2 className="my-5" style={{ fontSize: 31 }}>
					Join Twitter Today
				</h2>
				<Col sm={5} className="d-grid gap-2">
					<Button
						className="rounded-pill"
						variant="outline-dark"
						onClick={handleGoogleLogin}
					>
						<i className="bi bi-google"></i> Sign Up with Google
					</Button>
					<Button className="rounded-pill" variant="outline-dark">
						<i className="bi bi-apple"></i> Sign Up with Apple
					</Button>
					<p style={{ textAlign: "center" }}>or</p>
					<Button className="rounded-pill" onClick={handleShowSignUp}>
						Create an account
					</Button>
					<p style={{ fontSize: "12px" }}>
						{" "}
						Agree to terms and conditions
					</p>
					<p className="mt-5" style={{ fontWeight: "bold" }}>
						Already have an account?
					</p>
					<Button
						className="rounded-pill"
						variant="outline-primary"
						onClick={handleShowLogin}
					>
						Sign In
					</Button>
				</Col>
				<Modal
					show={modalShow !== null}
					onHide={handleClose}
					animation={false}
					centered
				>
					<Modal.Body>
						<h2 className="mb-4" style={{ fontWeight: "bold" }}>
							{modalShow === "signup"
								? "Create your account"
								: "Log in to your account"}
						</h2>

						<Form
							className="d-grid gap-2 px-5"
							onSubmit={
								modalShow === "signup"
									? handleSignUp
									: handleLogin
							}
						>
							<Form.Group
								className="mb-3"
								controlId="formBasicEmai"
							>
								<Form.Control
									onChange={(e) =>
										setUsername(e.target.value)
									}
									type="email"
									placeholder="Enter E-mail"
								/>
							</Form.Group>

							<Form.Group
								className="mb-3"
								controlId="formBasicPassword"
							>
								<Form.Control
									onChange={(e) =>
										setPassword(e.target.value)
									}
									type="password"
									placeholder="Enter Password"
								/>
							</Form.Group>

							<p style={{ fontSize: 12 }}>
								By signing up, you agree to the Terms of Service
								and Privacy Policy, including Cookie Use.
								SigmaTweets may use your contact information,
								including your email address and phone number
								for purposes outlined in our Privacy Policy,
								like keeping your account secure and
								personalising our services, including ads. Learn
								more. Others will be able to find you by email
								or phone number, when provided, unless you
								choose otherwise here.
							</p>
							<Button className="rounded-pill mb-2" type="submit">
								{modalShow === "signup" ? "Sign Up" : "Log In"}
							</Button>
							{/* Display error message */}
							{errorMessage && (
								<Alert variant="danger">{errorMessage}</Alert>
							)}
						</Form>
					</Modal.Body>
				</Modal>
			</Col>
		</Row>
	);
}
