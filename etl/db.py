engine = sqlalchemy.create_engine('mysql://root:@localhost/commodity', echo=True)
from sqlalchemy.orm import sessionmaker
Session = sessionmaker(bind=engine)
session = Session()