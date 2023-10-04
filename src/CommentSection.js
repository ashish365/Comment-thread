import React, { useState } from "react";
import "./App.css";

function CommentSection() {
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState("");
	const [parentCommentId, setParentCommentId] = useState(null);
	const [showReplyInput, setShowReplyInput] = useState({});

	const handleInputChange = (e) => {
		setNewComment(e.target.value);
	};

	const handleSubmit = () => {
		if (newComment.trim() !== "") {
			const newCommentObject = {
				id: Date.now(),
				text: newComment,
				replies: [],
			};

			if (parentCommentId !== null) {
				const updatedComments = handleReplySubmit(parentCommentId, comments);
				setComments(updatedComments);
				setShowReplyInput({});
				setParentCommentId(null);
			} else {
				setComments([...comments, newCommentObject]);
			}

			setNewComment("");
		}
	};

	const handleReply = (commentId) => {
		setShowReplyInput({ [commentId]: true });
		setParentCommentId(commentId);
	};

	const handleReplySubmit = (commentId, currentComments) => {
		if (newComment.trim() !== "") {
			const updatedComments = currentComments.map((comment) => {
				if (comment.id === commentId) {
					return {
						...comment,
						replies: [
							...comment.replies,
							{
								id: Date.now(),
								text: newComment,
								replies: [],
							},
						],
					};
				} else if (comment.replies.length > 0) {
					return {
						...comment,
						replies: handleReplySubmit(commentId, comment.replies),
					};
				}
				return comment;
			});

			return updatedComments;
		}

		return currentComments;
	};

	const handleReplySubmitTopLevel = () => {
		if (newComment.trim() !== "") {
			const updatedComments = handleReplySubmit(parentCommentId, comments);

			setComments(updatedComments);
			setShowReplyInput({});
			setParentCommentId(null);
			setNewComment("");
		}
	};

	const renderComments = (commentList) => {
		return (
			<ul className="comment-list">
				{commentList.map((comment) => (
					<li className="comment" key={comment.id}>
						<div className="comment-text">{comment.text}</div>
						<button
							className="reply-button"
							onClick={() => handleReply(comment.id)}
						>
							Reply
						</button>
						{showReplyInput[comment.id] && (
							<div className="reply-input">
								<input
									type="text"
									placeholder="Type your reply..."
									value={newComment}
									onChange={handleInputChange}
								/>
								<button onClick={handleReplySubmitTopLevel}>Submit</button>
							</div>
						)}
						{renderComments(comment.replies)}
					</li>
				))}
			</ul>
		);
	};

	return (
		<div className="comment-section">
			<h2>Reddit Comment Section</h2>
			<div className="comment-input">
				<input
					type="text"
					placeholder="Type your comment..."
					value={newComment}
					onChange={handleInputChange}
				/>
				<button onClick={handleSubmit}>Comment</button>
			</div>
			{renderComments(comments)}
		</div>
	);
}

export default CommentSection;
