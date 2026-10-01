---
id: independencia-condicional
titulo: Independencia condicional
titulo_en: Conditional independence
alias:
  - independencia dada una tercera variable
  - eventos condicionalmente independientes
modulo: 1
submodulo: '1.2'
orden: 11
nivel: basico
prerrequisitos:
  - independencia-de-eventos
  - ley-de-probabilidad-total
relaciones:
  - tipo: contrasta
    id: independencia-por-pares-vs-independencia-mutua
  - tipo: relacionado
    id: paradoja-de-simpson
etiquetas:
  - independencia
  - causa común
  - colisionador
  - modelos gráficos
resumen: >
  A y B son condicionalmente independientes dado C si, una vez que se sabe C, conocer A no cambia la
  probabilidad de B. No implica ni es implicada por la independencia sin condicionar.
formula: 'P(A \cap B \mid C) = P(A \mid C)\,P(B \mid C)'
visualizacion:
  componente: ProbabilityTree
  parametros:
    niveles: [Estado, Prueba 1, Prueba 2]
    contexto: Dos pruebas de laboratorio que fallan de manera independiente se aplican a la misma persona. El 10 % de las personas está enfermo; cada prueba da positivo con probabilidad 0.9 si hay enfermedad y 0.2 si no la hay.
    ramas:
      - etiqueta: Enfermo
        prob: 0.1
        ramas:
          - etiqueta: Pos
            prob: 0.9
            ramas:
              - etiqueta: Pos
                prob: 0.9
              - etiqueta: Neg
                prob: 0.1
          - etiqueta: Neg
            prob: 0.1
            ramas:
              - etiqueta: Pos
                prob: 0.9
              - etiqueta: Neg
                prob: 0.1
      - etiqueta: Sano
        prob: 0.9
        ramas:
          - etiqueta: Pos
            prob: 0.2
            ramas:
              - etiqueta: Pos
                prob: 0.2
              - etiqueta: Neg
                prob: 0.8
          - etiqueta: Neg
            prob: 0.8
            ramas:
              - etiqueta: Pos
                prob: 0.2
              - etiqueta: Neg
                prob: 0.8
    consultas:
      - nombre: Prueba 2 positiva
        hojas: [Enfermo/Pos/Pos, Enfermo/Neg/Pos, Sano/Pos/Pos, Sano/Neg/Pos]
      - nombre: Prueba 2 positiva dado prueba 1 positiva
        hojas: [Enfermo/Pos/Pos, Sano/Pos/Pos]
        condicion: [Enfermo/Pos/Pos, Enfermo/Pos/Neg, Sano/Pos/Pos, Sano/Pos/Neg]
      - nombre: Prueba 2 positiva dado enfermo y prueba 1 positiva
        hojas: [Enfermo/Pos/Pos]
        condicion: [Enfermo/Pos/Pos, Enfermo/Pos/Neg]
referencias:
  - clave: blitzstein-hwang
    capitulo: '2.5'
  - clave: pearl
    capitulo: '2'
publicado: true
---

## Intuición

Dos pruebas de laboratorio se aplican a la misma persona. Cada prueba se equivoca por razones propias (reactivos, manipulación), así que, para una persona cuyo estado se conoce, el resultado de una prueba no informa sobre el de la otra. Sin embargo, si no se sabe el estado de la persona, un primer resultado positivo sí sube la probabilidad de que el segundo también lo sea: el primer positivo hace más probable la enfermedad, y la enfermedad hace más probable el segundo positivo.

Esa es la independencia condicional: los resultados son independientes **dado** el estado de salud, aunque no sean independientes sin esa información. La causa común (la enfermedad) crea la asociación; al fijarla, la asociación desaparece.

También ocurre lo contrario. Dos monedas independientes se vuelven dependientes si se sabe que salió exactamente una cara: entonces, si la primera fue cara, la segunda tiene que ser cruz. Condicionar en un efecto común de dos causas independientes crea dependencia. Ambas situaciones son la base de los modelos gráficos y del razonamiento causal.

## Definición

:::definicion[Independencia condicional]
Sea $C$ un evento con $P(C) > 0$. Los eventos $A$ y $B$ son **condicionalmente independientes dado $C$** si
$$
P(A \cap B \mid C) = P(A \mid C)\,P(B \mid C).
$$
Si además $P(A \cap C) > 0$, esto equivale a $P(B \mid A \cap C) = P(B \mid C)$.
:::

Cuando se habla de independencia condicional "dada una variable", se exige la igualdad para cada valor de la variable, por ejemplo dado $C$ y dado $C^{c}$.

:::figura[Las dos pruebas dado que la persona está sana: la consulta muestra que P(prueba 2 positiva dado sano y prueba 1 positiva) es 0.2, la misma que dado sano solamente.]{componente="ProbabilityTree"}
```yaml
niveles: [Prueba 1, Prueba 2]
contexto: Solo personas sanas.
ramas:
  - etiqueta: Pos
    prob: 0.2
    ramas:
      - etiqueta: Pos
        prob: 0.2
      - etiqueta: Neg
        prob: 0.8
  - etiqueta: Neg
    prob: 0.8
    ramas:
      - etiqueta: Pos
        prob: 0.2
      - etiqueta: Neg
        prob: 0.8
consultas:
  - nombre: Prueba 2 positiva
    hojas: [Pos/Pos, Neg/Pos]
  - nombre: Prueba 2 positiva dado prueba 1 positiva
    hojas: [Pos/Pos]
    condicion: [Pos/Pos, Pos/Neg]
```
:::

:::nota[Qué significa cada símbolo]
- $A$, $B$: eventos (por ejemplo, resultados de dos pruebas).
- $C$: evento que se da por conocido (por ejemplo, el estado de salud); $C^{c}$: su complemento.
- $P(A \cap B \mid C)$: probabilidad de que ocurran $A$ y $B$ sabiendo $C$.
- $P(A \mid C)$, $P(B \mid C)$: probabilidades de cada uno sabiendo $C$.
- $T_1$, $T_2$: en el ejemplo, positivos de la primera y la segunda prueba; $E$: enfermo.
:::

## Cómo usar la visualización

El árbol tiene tres niveles: estado de salud, primera prueba y segunda prueba. Dentro de cada estado, las ramas de la segunda prueba son iguales sin importar la primera: esa es la independencia condicional. El selector recorre tres consultas: la probabilidad de que la segunda prueba sea positiva (0.27), la misma probabilidad sabiendo que la primera fue positiva (cerca de 0.43) y la misma sabiendo además que la persona está enferma (0.9, igual que sin saber la primera prueba).

La segunda consulta revela la dependencia marginal: un primer positivo sube la probabilidad del segundo de 0.27 a 0.43. La tercera muestra que, fijado el estado, el primer resultado ya no aporta nada.

## Ejemplo

Con los datos del árbol: $P(E) = 0.1$, $P(T_i \mid E) = 0.9$ y $P(T_i \mid E^{c}) = 0.2$, con $T_1$ y $T_2$ condicionalmente independientes dado $E$ y dado $E^{c}$.

1. $P(T_2) = 0.9 \cdot 0.1 + 0.2 \cdot 0.9 = 0.27$.
2. $P(T_1 \cap T_2) = 0.9^2 \cdot 0.1 + 0.2^2 \cdot 0.9 = 0.081 + 0.036 = 0.117$.
3. $P(T_2 \mid T_1) = 0.117/0.27 \approx 0.433$.
4. Como $0.433 \neq 0.27$, $T_1$ y $T_2$ no son independientes sin condicionar.
5. Dado $E$: $P(T_1 \cap T_2 \mid E) = 0.81 = 0.9 \cdot 0.9$, de modo que sí son independientes dado $E$.

:::figura[El primer positivo como evidencia: tras un positivo, la probabilidad de enfermedad sube de 0.1 a 0.33, y eso explica por qué el segundo positivo se vuelve más probable aunque las pruebas fallen de manera independiente.]{componente="BayesUpdater"}
```yaml
hipotesis:
  - nombre: Enfermo
    prior: 0.1
  - nombre: Sano
    prior: 0.9
observaciones:
  - nombre: Positivo
    verosimilitudes: [0.9, 0.2]
  - nombre: Negativo
    verosimilitudes: [0.1, 0.8]
secuencia: [Positivo, Positivo]
```
:::

## Propiedades

- **No implica independencia:** dos efectos de una causa común son condicionalmente independientes dada la causa y, en general, dependientes sin condicionar.
- **No es implicada por la independencia:** dos causas independientes de un efecto común se vuelven dependientes al condicionar en el efecto (sesgo por colisionador o efecto de "explicación alternativa").
- **Factorización:** si $A$ y $B$ son condicionalmente independientes dado $C$ y dado $C^{c}$, entonces $P(A \cap B) = P(A \mid C)P(B \mid C)P(C) + P(A \mid C^{c})P(B \mid C^{c})P(C^{c})$.
- **Actualización con varios datos:** la independencia condicional de los datos dada la hipótesis es lo que permite aplicar el teorema de Bayes un dato a la vez.

:::figura[Dependencia creada al condicionar: dos monedas independientes. Sabiendo que salió exactamente una cara, P(segunda cara) es 1/2, pero P(segunda cara dado primera cara y exactamente una cara) es 0.]{componente="ProbabilityTree"}
```yaml
niveles: [Moneda 1, Moneda 2]
ramas:
  - etiqueta: C
    prob: 0.5
    ramas:
      - etiqueta: C
        prob: 0.5
      - etiqueta: X
        prob: 0.5
  - etiqueta: X
    prob: 0.5
    ramas:
      - etiqueta: C
        prob: 0.5
      - etiqueta: X
        prob: 0.5
consultas:
  - nombre: Segunda cara dado exactamente una
    hojas: [X/C]
    condicion: [C/X, X/C]
  - nombre: Segunda cara dado primera cara y exactamente una
    hojas: [C/C]
    condicion: [C/X]
```
:::

## Errores comunes

- **Concluir independencia a partir de independencia condicional,** o al revés. Son propiedades distintas que hay que verificar por separado.
- **Condicionar en un efecto común sin advertir el sesgo.** Si un hospital solo admite pacientes con enfermedad A o enfermedad B, dentro del hospital las dos enfermedades parecen negativamente asociadas aunque en la población sean independientes.
- **Tratar pruebas repetidas como independientes sin condicionar.** Las pruebas son independientes dado el estado del paciente, no en la población general.

:::figura[Sesgo de admisión: un hospital solo recibe a quien tiene la enfermedad A o la B, independientes en la población con probabilidades 0.3 y 0.2. Entre los admitidos, P(B dado A) = 0.2, pero P(B dado no A) = 1, de modo que las enfermedades parecen excluirse.]{componente="ProbabilityTree"}
```yaml
niveles: [Enfermedad A, Enfermedad B]
ramas:
  - etiqueta: A
    prob: 0.3
    ramas:
      - etiqueta: B
        prob: 0.2
      - etiqueta: Sin B
        prob: 0.8
  - etiqueta: Sin A
    prob: 0.7
    ramas:
      - etiqueta: B
        prob: 0.2
      - etiqueta: Sin B
        prob: 0.8
consultas:
  - nombre: B dado A y admitido
    hojas: [A/B]
    condicion: [A/B, A/Sin B]
  - nombre: B dado sin A y admitido
    hojas: [Sin A/B]
    condicion: [Sin A/B]
```
:::

## Conexiones

La independencia condicional combina la [[independencia-de-eventos]] con la [[probabilidad-condicional]] y se analiza con la [[ley-de-probabilidad-total]] sobre la variable que se condiciona. No coincide con la independencia mutua ([[independencia-por-pares-vs-independencia-mutua]]) ni se deduce de ella. Explica la [[paradoja-de-simpson]], donde una variable oculta crea o invierte asociaciones, y es el lenguaje de las redes bayesianas y de la inferencia causal, donde las causas comunes y los colisionadores determinan qué asociaciones aparecen al condicionar.

## Formulario

:::formula[Independencia condicional]
$$
P(A \cap B \mid C) = P(A \mid C)\,P(B \mid C)
$$

- $C$: evento conocido con $P(C) > 0$.
:::

:::formula[Forma equivalente]
$$
P(B \mid A \cap C) = P(B \mid C)
$$

- Una vez que se sabe $C$, saber $A$ no cambia la probabilidad de $B$.
:::

:::formula[Probabilidad conjunta con una causa común]
$$
P(A \cap B) = \sum_{c \in \{C,\, C^{c}\}} P(A \mid c)\,P(B \mid c)\,P(c)
$$

- La suma recorre los dos casos de la variable que se condiciona.
:::
