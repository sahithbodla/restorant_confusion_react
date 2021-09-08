import React from 'react';
import {Card, CardImg, CardText, CardTitle, CardBody, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, ModalBody, Row,Col,Label} from 'reactstrap'
import {Link} from 'react-router-dom'
import {Control, LocalForm, Errors} from 'react-redux-form'
import { Loading } from './LoadingComponent';
import {baseUrl} from '../shared/baseUrl';

    function RenderDish({dish}){
        if(dish!=null){
            return(
                <Card>
                    <CardImg top src={baseUrl + dish.image} alt={dish.name}/>
                    <CardBody>
                        <CardTitle>{dish.name}</CardTitle>
                        <CardText>{dish.description}</CardText>
                    </CardBody>
                </Card>
            )
        } else return <div></div>
    }

    function RenderComments({comments, dishId, postComment}){
        if(comments!=null){
            const commentRender = comments.map((comment)=>{
                const commentedDate = new Date(comment.date)
                const displayDate = `${commentedDate.toLocaleString('default',{month: 'short'})} ${commentedDate.getDate()}, ${commentedDate.getFullYear()}`
                return (
                    <div key={comment.id}>
                        <ul className="list-unstyled">
                            <li>{comment.comment}</li> <br/>
                            <li>-- {comment.author}, {displayDate}</li>
                        </ul>
                    </div>
                )
            })
            return (
                <div>
                    <h4>Comments</h4>
                    {commentRender}
                    <CommentForm dishId={dishId} postComment={postComment}/>
                </div>
            )
        } else return <div></div>
    }

    const required = (val) => val && val.length;
    const maxLength = (len) => (val) => !(val) || (val.length <= len);
    const minLength = (len) => (val) => val && (val.length >= len);

    class CommentForm extends React.Component {

        constructor(props){
            super(props);
            this.state = {
                isModalOpen: false
            }
            this.toggleModal = this.toggleModal.bind(this)
        }

        toggleModal(){
            this.setState({isModalOpen: !this.state.isModalOpen})
        };

        handleSubmit = (values) => {
            this.setState({isModalOpen: !this.state.isModalOpen});
            this.props.postComment(this.props.dishId,values.rating,values.authorName,values.comment)
        }

        render(){
            return (
                <>
                <Button outline color="secondary" onClick={this.toggleModal}>
                    <span className="fa fa-pencil lg"></span> Submit Comment
                </Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>
                        Submit Comment
                    </ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                            <Row className="form-group">
                                <Col md={12}>
                                    <Label htmlFor="rating">Rating</Label>
                                </Col>
                                <Col>
                                    <Control.select model=".rating" name="rating" className="form-control">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                </Col>
                            </Row> <br />
                            <Row className="form-group">
                                <Col md={12}>
                                    <Label htmlFor="authorName">Your Name</Label>
                                </Col><br />
                                <Col>
                                    <Control.text model=".authorName"
                                    id="authorName"
                                    name="authorName"
                                    placeholder="Your Name"
                                    className="form-control"
                                    validators={{
                                            required, minLength: minLength(3), maxLength: maxLength(15)
                                        }}
                                    />
                                    <Errors
                                        className="text-danger"
                                        model=".authorName"
                                        show="touched"
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be greater than 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                     />
                                </Col>
                            </Row> <br />
                            <Row className="form-group">
                                <Col md={12}>
                                        <Label htmlFor="comment">Comment</Label>
                                </Col>
                                <Col>
                                    <Control.textarea model=".comment" name="comment" id="comment" rows="6" className="form-control" />
                                </Col>
                            </Row> <br />
                            <Row className="form-group">
                                <Col>
                                    <Button type="submit" color="primary">Submit</Button>
                                </Col>
                            </Row>
                        </LocalForm>
                    </ModalBody>
                </Modal>
                </>
            )
        }
    }

    const DishDetail = (props) => {

        if(props.isLoading){
            return(
                <div className="container">
                    <div className="row">
                        <Loading />
                    </div>
                </div>
            )
        } else if(props.errMess){
            return(
                <div className="container">
                    <div className="row">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            )
        } else if(props.dish != null){
            return(
                <div className="container">
                    <div className="row">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <div className="col-12">
                            <h3>{props.dish.name}</h3>
                            <br />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-md-5 m-1">
                            <RenderDish dish={props.dish}/>
                        </div>
                        <div className="col-12 col-md-5 m-1">
                            <RenderComments comments={props.comments}
                            postComment={props.postComment}
                            dishId={props.dish.id}
                            />
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div></div>
            )
        }
    }
    

export default DishDetail;