import streamlit as st
import joblib
import re

# Load saved model and vectorizer
tfidf = joblib.load('tfidf_vectorizer.pkl')
model = joblib.load('sentiment_model.pkl')

# Function to clean text
def clean_text(text):
    text = text.lower()
    text = re.sub(r"http\S+|www\S+|https\S+", '', text)
    text = re.sub(r"@\w+", '', text)
    text = re.sub(r"[^a-zA-Z\s]", '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# Streamlit UI
st.title("Teen Social Media Sentiment Predictor 😄😞")
st.write("Enter a social media post and see if it's Positive or Negative!")

# Input text
user_input = st.text_area("Type your post here:")

if st.button("Predict Sentiment"):
    if user_input.strip() == "":
        st.warning("Please enter some text to predict.")
    else:
        # Clean and transform input
        cleaned_input = clean_text(user_input)
        input_vector = tfidf.transform([cleaned_input])

        # Predict
        prediction = model.predict(input_vector)[0]
        proba = model.predict_proba(input_vector)[0]

        # Show result
        if prediction == 1:
            st.success(f"Positive Sentiment! 😊 (Confidence: {proba[1]*100:.2f}%)")
        else:
            st.error(f"Negative Sentiment! 😞 (Confidence: {proba[0]*100:.2f}%)")
