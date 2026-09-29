---
id: identidades-del-coeficiente-binomial
titulo: Identidades del coeficiente binomial (Pascal, Vandermonde)
titulo_en: Binomial coefficient identities (Pascal, Vandermonde)
alias:
  - regla de Pascal
  - identidad de Vandermonde
  - demostraciones combinatorias
  - conteo doble
modulo: 0
submodulo: '0.2'
orden: 11
nivel: basico
prerrequisitos:
  - coeficiente-binomial
etiquetas:
  - coeficiente binomial
  - demostración combinatoria
  - conteo doble
  - identidades
resumen: >
  Los coeficientes binomiales cumplen identidades que se demuestran contando un mismo conjunto de dos
  maneras: la regla de Pascal separa según un elemento fijo y la de Vandermonde según el grupo de origen.
formula: '\binom{n}{k} = \binom{n-1}{k-1} + \binom{n-1}{k},\qquad \binom{m+p}{r} = \sum_{j} \binom{m}{j}\binom{p}{r-j}'
visualizacion:
  componente: PascalTriangle
  parametros:
    modo: identidades
    identidad: pascal
    identidades: [pascal, vandermonde, simetria, suma-de-fila]
    n: 5
    k: 2
    grupos: [3, 4]
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Una escuela tiene 5 profesores de ciencias y debe elegir 2 para un congreso. Hay $\binom{5}{2} = 10$ parejas. Supongamos que una de las profesoras, la de química, tiene una situación especial y conviene separar los casos: o va al congreso, o no va. Si va, falta elegir a 1 de los otros 4; si no va, hay que elegir a los 2 entre los otros 4. En total, $\binom{4}{1} + \binom{4}{2} = 4 + 6 = 10$. Esa es la regla de Pascal.

Ahora supongamos que se elige un comité de 4 personas de un grupo formado por 3 docentes y 4 estudiantes. Se puede contar directamente, $\binom{7}{4} = 35$, o separar según cuántos docentes entren: ninguno, uno, dos o tres. Sumando los casos se obtiene la identidad de Vandermonde.

En los dos ejemplos la identidad no se demuestra con álgebra, sino contando el mismo conjunto de dos formas. Ese método, llamado demostración combinatoria o conteo doble, suele dar además la razón de por qué la identidad es cierta.

## Definición

:::teorema[Identidades básicas]
Para enteros no negativos, con la convención $\binom{n}{k} = 0$ fuera de $0 \le k \le n$:

1. **Simetría:** $\binom{n}{k} = \binom{n}{n-k}$.
2. **Regla de Pascal:** $\binom{n}{k} = \binom{n-1}{k-1} + \binom{n-1}{k}$ para $n \ge 1$.
3. **Suma de una fila:** $\sum_{k=0}^{n} \binom{n}{k} = 2^n$.
4. **Identidad de Vandermonde:** $\binom{m+p}{r} = \sum_{j=0}^{r} \binom{m}{j}\binom{p}{r-j}$.
:::

:::demostracion
Para la regla de Pascal, se fija el elemento $n$ del conjunto $\{1, \dots, n\}$. Los subconjuntos de tamaño $k$ que lo contienen se forman eligiendo $k - 1$ de los otros $n - 1$; los que no lo contienen, eligiendo $k$ de los otros $n - 1$. Los dos casos son disjuntos y cubren todo, así que se suman. Para Vandermonde, un comité de $r$ personas de dos grupos de tamaños $m$ y $p$ tiene $j$ miembros del primero y $r - j$ del segundo para un único $j$; para cada $j$ hay $\binom{m}{j}\binom{p}{r-j}$ comités.
:::

## Cómo usar la visualización

Se listan todos los objetos que cuenta el lado izquierdo de la identidad y cada uno se deposita en la columna del término del lado derecho que lo cuenta. El selector cambia de identidad; los controles ajustan $n$, $k$ y el tamaño de los grupos para Vandermonde.

Con la regla de Pascal, $n = 5$ y $k = 2$, los 10 subconjuntos se reparten en 6 que no contienen al 5 y 4 que sí. En la identidad de Vandermonde con grupos de 3 y 4 y comités de 2, las columnas tienen 6, 12 y 3 comités, que suman $\binom{7}{2} = 21$. En la simetría, cada subconjunto aparece junto a su complemento.

## Ejemplo

Se verifica la identidad $\sum_{k=0}^{n} \binom{n}{k}^2 = \binom{2n}{n}$ para $n = 4$ y se da su demostración.

1. Lado izquierdo: $1^2 + 4^2 + 6^2 + 4^2 + 1^2 = 1 + 16 + 36 + 16 + 1 = 70$.
2. Lado derecho: $\binom{8}{4} = 70$.
3. Demostración: es Vandermonde con $m = p = r = n$, porque $\binom{n}{k}\binom{n}{n-k} = \binom{n}{k}^2$ por simetría. En palabras: elegir $n$ personas de un grupo de $n$ mujeres y $n$ hombres, separando por el número $k$ de mujeres.

## Propiedades

- **Absorción:** $k\binom{n}{k} = n\binom{n-1}{k-1}$; se prueba contando comités con presidente de dos maneras.
- **Palo de hockey:** $\sum_{i=k}^{n} \binom{i}{k} = \binom{n+1}{k+1}$.
- **Suma alternada:** $\sum_{k=0}^{n} (-1)^k \binom{n}{k} = 0$ para $n \ge 1$: hay tantos subconjuntos de tamaño par como de tamaño impar.
- **Suma ponderada:** $\sum_{k} k\binom{n}{k} = n\,2^{n-1}$.

## Errores comunes

- **Olvidar la convención de ceros.** En Vandermonde, términos como $\binom{3}{4}$ valen 0 y no deben omitirse de forma que cambie el rango.
- **Tratar los casos como no disjuntos.** En una demostración por casos hay que verificar que cada objeto cae en exactamente un caso.
- **Confundir la regla de Pascal con $\binom{n}{k} = \binom{n-1}{k} + \binom{n-1}{k+1}$.** Los índices inferiores de la suma son $k - 1$ y $k$.

## Conexiones

Estas identidades describen propiedades del [[coeficiente-binomial]]. La regla de Pascal construye el [[triangulo-de-pascal]], y la suma de una fila cuenta el [[conjunto-potencia]]. Las demostraciones separan en casos con el [[principio-de-la-suma]]. En probabilidad, Vandermonde garantiza que las probabilidades de la distribución hipergeométrica suman 1.
