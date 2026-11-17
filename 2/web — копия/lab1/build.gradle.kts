plugins {
    id("java")
}

group = "org.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    testImplementation(platform("org.junit:junit-bom:5.10.0"))
    testImplementation("org.junit.jupiter:junit-jupiter")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")

    implementation(files("libs/fastcgi-lib.jar"))
}


tasks.jar {
    manifest {
        attributes(
            "Main-Class" to "ru.C1ronz.web.Main"
        )
    }

    from({
        configurations.runtimeClasspath.get().filter { it.isDirectory || it.name.endsWith(".jar") }.map {
            if (it.isDirectory) it else zipTree(it)
        }
    })

    archiveFileName.set("lab1.jar")
}

tasks.test {
    useJUnitPlatform()
}