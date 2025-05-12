from setuptools import setup, find_packages

setup(
    name="policy_scraper",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "requests",
        "beautifulsoup4",
        "google-api-python-client",
        "python-dotenv",
        "validators",
        "tldextract",
    ],
    python_requires=">=3.7",
    author="PolicySense Team",
    description="A modular system for scraping and analyzing policy documents",
    long_description=open("../README.md").read(),
    long_description_content_type="text/markdown",
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
    ],
) 