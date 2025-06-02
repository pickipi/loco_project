plugins {
	java
	id("org.springframework.boot") version "3.2.3"
	id("io.spring.dependency-management") version "1.1.4"
}

group = "com.likelion"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-data-jpa") // JPA 관련 어노테이션 추가
	implementation("org.springframework.boot:spring-boot-starter-validation") // Validation 관련 어노테이션 추가
	implementation("org.springframework.boot:spring-boot-starter-web")
	compileOnly("org.projectlombok:lombok")
	developmentOnly("org.springframework.boot:spring-boot-devtools")
	annotationProcessor("org.projectlombok:lombok")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")

	// 데이터베이스 관련
	runtimeOnly("com.h2database:h2")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	runtimeOnly("com.mysql:mysql-connector-j")

	// Spring Security Core (암호화)
	implementation("org.springframework.boot:spring-boot-starter-security")

	// Spring Security OAuth2 관련 의존성 추가
	implementation("org.springframework.security:spring-security-oauth2-jose")
	implementation("org.springframework.security:spring-security-oauth2-resource-server")
	implementation("org.springframework.security:spring-security-oauth2-client")
	implementation("org.springframework.boot:spring-boot-starter-oauth2-resource-server")
	implementation("org.springframework.boot:spring-boot-starter-oauth2-client")

	//Swagger 라이브러리 추가
	implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.2.0")

	// 타임리프 추가
	implementation("org.springframework.boot:spring-boot-starter-thymeleaf")

	// AWS S3 관련 라이브러리 추가 (버전 명시 필수)
	implementation("software.amazon.awssdk:s3:2.20.160") // AWS SDK for S3 v2 의존성 추가

	//websocket 추가
	implementation("org.springframework.boot:spring-boot-starter-websocket")

	implementation("io.jsonwebtoken:jjwt-api:0.11.5")
	implementation("io.jsonwebtoken:jjwt-impl:0.11.5")
	implementation("io.jsonwebtoken:jjwt-jackson:0.11.5") // jackson serializer 사용

	//Toss Payments 추가
	implementation("com.fasterxml.jackson.core:jackson-databind")

	//구글 SMTP 설정
	implementation("org.springframework.boot:spring-boot-starter-mail:3.0.5")

	//Redis(이메일 인증번호)
	implementation("org.springframework.boot:spring-boot-starter-data-redis")

	//OAuth2 클라이언트
	implementation ("org.springframework.boot:spring-boot-starter-oauth2-client")

}

tasks.withType<JavaCompile> {
	options.compilerArgs.addAll(listOf("-parameters"))
}

tasks.withType<Test> {
	useJUnitPlatform()
}

// Java 컴파일러에 -parameters 옵션 추가
tasks.withType<JavaCompile> {
    options.compilerArgs.add("-parameters")
}